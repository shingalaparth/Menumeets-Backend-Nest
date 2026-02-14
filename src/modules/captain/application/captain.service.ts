import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ShopService } from '../../shop/application/shop.service';
import { OrderService } from '../../order/application/order.service';
import { TableService } from '../../table/application/table.service';
import { InvoiceService } from '../../invoice/application/invoice.service';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { EventsService } from '../../../shared/services/events.service';

@Injectable()
export class CaptainService {
    constructor(
        private shopService: ShopService,
        private orderService: OrderService,
        private tableService: TableService,
        private jwtService: JwtService,
        private invoiceService: InvoiceService,
        private prisma: PrismaService,
        private events: EventsService
    ) { }

    // ──────────────────────────────────────
    // Auth
    // ──────────────────────────────────────
    async login(shopId: string, pin: string) {
        const shop = await this.shopService.getShopById(shopId);
        if (!shop) throw new NotFoundException('Shop not found');

        if (!shop.captainPin || String(shop.captainPin) !== String(pin)) {
            throw new UnauthorizedException('Invalid Captain PIN');
        }

        const token = this.jwtService.sign({ sub: shop.id, role: 'captain', name: shop.name });
        return {
            success: true,
            token,
            shop: {
                id: shop.id,
                name: shop.name,
                features: (shop.settings as any)?.featureAccess,
                settings: shop.settings
            }
        };
    }

    // ──────────────────────────────────────
    // Dashboard
    // ──────────────────────────────────────
    async getDashboard(shopId: string) {
        const tables = await this.tableService.getTablesForShopInternal(shopId);
        const activeSessions = await this.tableService.getActiveSessions(shopId);

        const sessionIds = activeSessions.map(s => s.id);
        const totals = await this.orderService.getSessionTotals(sessionIds);

        // Get pending waiter calls from DB
        const waiterCalls = await this.prisma.waiterCall.findMany({
            where: { shopId, status: 'PENDING' },
            include: { table: true },
            orderBy: { createdAt: 'desc' }
        });

        return {
            tables,
            activeSessions: activeSessions.map(s => ({
                ...s,
                totalAmount: totals[s.id] || 0
            })),
            waiterCalls
        };
    }

    // ──────────────────────────────────────
    // Session Management
    // ──────────────────────────────────────
    async startSession(shopId: string, data: any) {
        const session = await this.tableService.startSessionInternal(shopId, data);
        this.events.emitSessionUpdate(shopId, { type: 'SESSION_OPENED', session });
        return session;
    }

    async closeSession(shopId: string, sessionId: string, paymentMethod: string) {
        const session = await this.tableService.getSessionById(sessionId);
        if (!session) throw new NotFoundException('Session not found');
        if (session.shopId !== shopId) throw new UnauthorizedException('Access denied');

        // Pay all unpaid orders
        await this.orderService.markSessionOrdersPaid(sessionId, paymentMethod || 'CASH');

        // Get all orders for invoice
        const orders = await this.orderService.getSessionOrders(sessionId);

        // Generate consolidated invoice
        let invoice = null;
        if (orders.length > 0) {
            invoice = await this.invoiceService.createConsolidatedInvoiceForSession(session, orders);
        }

        // Close Session
        await this.tableService.closeSessionInternal(shopId, sessionId);
        this.events.emitSessionUpdate(shopId, { type: 'SESSION_CLOSED', sessionId });

        return { message: 'Session Closed', invoice };
    }

    async getSessionDetails(shopId: string, sessionId: string) {
        const session = await this.tableService.getSessionById(sessionId);
        if (!session) throw new NotFoundException('Session not found');
        if (session.shopId !== shopId) throw new UnauthorizedException('Access denied');

        const orders = await this.orderService.getSessionOrders(sessionId);
        const totalAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0);

        return {
            session,
            orders,
            totalAmount,
            itemCount: orders.reduce((sum, o) => sum + ((o as any).items?.length || 0), 0)
        };
    }

    async getSessionHistory(shopId: string, page = 1, limit = 20) {
        return this.tableService.getClosedSessions(shopId, page, limit);
    }

    async getActiveSessions(shopId: string) {
        const sessions = await this.prisma.tableSession.findMany({
            where: { shopId, status: 'ACTIVE' },
            include: {
                table: true,
                orders: {
                    include: { items: true }
                }
            },
            orderBy: { openedAt: 'desc' }
        });

        return sessions.map(s => ({
            ...s,
            totalAmount: s.orders.reduce((sum, o) => sum + o.totalAmount, 0),
            orderCount: s.orders.length
        }));
    }

    // ──────────────────────────────────────
    // Table Operations
    // ──────────────────────────────────────
    async changeTable(shopId: string, sessionId: string, newTableId: string) {
        return this.tableService.changeTableSession(shopId, { sub: shopId, role: 'captain' } as any, {
            sessionId,
            newTableId
        });
    }

    async mergeTables(shopId: string, sessionId: string, tableIds: string[]) {
        return this.tableService.mergeTableSession(shopId, { sub: shopId, role: 'captain' } as any, {
            sessionId,
            tableIds
        });
    }

    // ──────────────────────────────────────
    // Waiter Call (DB-backed + Real-Time)
    // ──────────────────────────────────────
    async callWaiter(shopId: string, tableId: string, sessionId?: string) {
        // Check for existing pending call from the same table
        const existing = await this.prisma.waiterCall.findFirst({
            where: { shopId, tableId, status: 'PENDING' }
        });
        if (existing) {
            return { message: 'Waiter call already pending', call: existing };
        }

        const call = await this.prisma.waiterCall.create({
            data: { shopId, tableId, sessionId: sessionId || null },
            include: { table: true }
        });

        // Emit real-time event to shop dashboard
        this.events.emitTableCall(shopId, {
            callId: call.id,
            tableId,
            tableNumber: (call as any).table?.tableNumber,
            sessionId,
            createdAt: call.createdAt
        });

        return { message: 'Waiter called', call };
    }

    async resolveWaiterCall(shopId: string, callId: string) {
        const call = await this.prisma.waiterCall.findUnique({ where: { id: callId } });
        if (!call) throw new NotFoundException('Waiter call not found');
        if (call.shopId !== shopId) throw new UnauthorizedException('Access denied');

        const updated = await this.prisma.waiterCall.update({
            where: { id: callId },
            data: {
                status: 'RESOLVED',
                resolvedBy: shopId, // Captain's shopId
                resolvedAt: new Date()
            }
        });

        this.events.emitTableCallResolved(shopId, {
            callId: updated.id,
            tableId: updated.tableId,
            resolvedAt: updated.resolvedAt
        });

        return { message: 'Waiter call resolved', call: updated };
    }

    // ──────────────────────────────────────
    // Split Bill
    // ──────────────────────────────────────
    async splitBill(shopId: string, sessionId: string, splits: number) {
        const session = await this.tableService.getSessionById(sessionId);
        if (!session) throw new NotFoundException('Session not found');
        if (session.shopId !== shopId) throw new UnauthorizedException('Access denied');
        if (splits < 2 || splits > 20) throw new BadRequestException('Splits must be between 2 and 20');

        const orders = await this.orderService.getSessionOrders(sessionId);
        const subtotal = orders.reduce((sum, o) => sum + o.subtotal, 0);
        const totalAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0);
        const totalTax = totalAmount - subtotal;

        // Each split gets proportional share
        const splitSubtotal = Math.round((subtotal / splits) * 100) / 100;
        const splitTax = Math.round((totalTax / splits) * 100) / 100;
        const splitTotal = Math.round((totalAmount / splits) * 100) / 100;

        // Handle rounding remainder on last split
        const remainder = Math.round((totalAmount - (splitTotal * splits)) * 100) / 100;

        const splitBills = Array.from({ length: splits }, (_, i) => ({
            splitNumber: i + 1,
            subtotal: splitSubtotal,
            tax: splitTax,
            total: i === splits - 1 ? splitTotal + remainder : splitTotal
        }));

        return {
            sessionId,
            originalTotal: totalAmount,
            originalSubtotal: subtotal,
            originalTax: totalTax,
            splits: splitBills,
            orderCount: orders.length,
            items: orders.flatMap((o: any) => o.items || [])
        };
    }

    // ──────────────────────────────────────
    // Print Bill (structured data for thermal/ESC-POS)
    // ──────────────────────────────────────
    async printBill(shopId: string, sessionId: string) {
        const session = await this.tableService.getSessionById(sessionId);
        if (!session) throw new NotFoundException('Session not found');
        if (session.shopId !== shopId) throw new UnauthorizedException('Access denied');

        const shop = await this.shopService.getShopById(shopId);
        if (!shop) throw new NotFoundException('Shop not found');

        const orders = await this.orderService.getSessionOrders(sessionId);
        const allItems: any[] = [];

        orders.forEach((order: any) => {
            (order.items || []).forEach((item: any) => {
                allItems.push({
                    name: item.name,
                    qty: item.quantity,
                    price: item.price,
                    total: item.price * item.quantity,
                    variant: item.variant,
                    addOns: item.addOns
                });
            });
        });

        const subtotal = orders.reduce((sum, o) => sum + o.subtotal, 0);
        const totalAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0);
        const totalTax = totalAmount - subtotal;

        return {
            shopName: shop.name,
            shopAddress: shop.address,
            shopPhone: shop.phone,
            tableNumber: (session as any).table?.tableNumber || 'N/A',
            sessionCode: session.sessionCode,
            customerName: session.customerName,
            pax: session.pax,
            items: allItems,
            subtotal,
            tax: totalTax,
            total: totalAmount,
            orderCount: orders.length,
            openedAt: session.openedAt,
            printedAt: new Date()
        };
    }

    // ──────────────────────────────────────
    // Menu
    // ──────────────────────────────────────
    async getMenu(shopId: string) {
        const categories = await this.prisma.category.findMany({
            where: { shopId, isActive: true, isArchived: false },
            include: {
                menuItems: {
                    where: { isAvailable: true, isArchived: false },
                    orderBy: { sortOrder: 'asc' }
                }
            },
            orderBy: { sortOrder: 'asc' }
        });
        return categories;
    }

    // ──────────────────────────────────────
    // Captain Order Operations
    // ──────────────────────────────────────
    async placeOrder(shopId: string, body: any) {
        const shop = await this.shopService.getShopById(shopId);
        if (!shop) throw new NotFoundException('Shop not found');

        const order = await this.orderService.placePOSOrder(shop.ownerId, {
            ...body,
            shopId
        });

        // Emit new order event
        this.events.emitNewOrder(shopId, order);
        return order;
    }

    async voidItem(shopId: string, orderId: string, itemId: string, reason?: string) {
        const order = await this.orderService.getOrderById(orderId);
        if (!order) throw new NotFoundException('Order not found');
        if ((order as any).shopId !== shopId) throw new UnauthorizedException('Access denied');

        // Remove the item from the order
        await this.prisma.orderItem.delete({ where: { id: itemId } });

        // Recalculate totals
        const remainingItems = await this.prisma.orderItem.findMany({ where: { orderId } });
        const newSubtotal = remainingItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const taxRate = (order as any).taxDetails?.rate
            ? parseFloat(String((order as any).taxDetails.rate).replace('%', ''))
            : 5;
        const taxAmount = newSubtotal * (taxRate / 100);

        const updated = await this.prisma.order.update({
            where: { id: orderId },
            data: {
                subtotal: newSubtotal,
                totalAmount: newSubtotal + taxAmount,
                taxDetails: { taxAmount, rate: `${taxRate}%` }
            }
        });

        this.events.emitOrderStatusUpdate(shopId, updated);
        return { message: 'Item voided', reason };
    }

    async modifyOrder(shopId: string, orderId: string, body: any) {
        const order = await this.orderService.getOrderById(orderId);
        if (!order) throw new NotFoundException('Order not found');
        if ((order as any).shopId !== shopId) throw new UnauthorizedException('Access denied');

        const result = await this.orderService.modifyOrder(orderId, body);
        this.events.emitOrderStatusUpdate(shopId, result);
        return result;
    }
}
