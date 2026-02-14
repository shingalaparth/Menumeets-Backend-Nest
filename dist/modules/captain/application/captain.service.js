"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaptainService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const shop_service_1 = require("../../shop/application/shop.service");
const order_service_1 = require("../../order/application/order.service");
const table_service_1 = require("../../table/application/table.service");
const invoice_service_1 = require("../../invoice/application/invoice.service");
const prisma_service_1 = require("../../../infrastructure/database/prisma.service");
const events_service_1 = require("../../../shared/services/events.service");
let CaptainService = class CaptainService {
    constructor(shopService, orderService, tableService, jwtService, invoiceService, prisma, events) {
        this.shopService = shopService;
        this.orderService = orderService;
        this.tableService = tableService;
        this.jwtService = jwtService;
        this.invoiceService = invoiceService;
        this.prisma = prisma;
        this.events = events;
    }
    async login(shopId, pin) {
        const shop = await this.shopService.getShopById(shopId);
        if (!shop)
            throw new common_1.NotFoundException('Shop not found');
        if (!shop.captainPin || String(shop.captainPin) !== String(pin)) {
            throw new common_1.UnauthorizedException('Invalid Captain PIN');
        }
        const token = this.jwtService.sign({ sub: shop.id, role: 'captain', name: shop.name });
        return {
            success: true,
            token,
            shop: {
                id: shop.id,
                name: shop.name,
                features: shop.settings?.featureAccess,
                settings: shop.settings
            }
        };
    }
    async getDashboard(shopId) {
        const tables = await this.tableService.getTablesForShopInternal(shopId);
        const activeSessions = await this.tableService.getActiveSessions(shopId);
        const sessionIds = activeSessions.map(s => s.id);
        const totals = await this.orderService.getSessionTotals(sessionIds);
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
    async startSession(shopId, data) {
        const session = await this.tableService.startSessionInternal(shopId, data);
        this.events.emitSessionUpdate(shopId, { type: 'SESSION_OPENED', session });
        return session;
    }
    async closeSession(shopId, sessionId, paymentMethod) {
        const session = await this.tableService.getSessionById(sessionId);
        if (!session)
            throw new common_1.NotFoundException('Session not found');
        if (session.shopId !== shopId)
            throw new common_1.UnauthorizedException('Access denied');
        await this.orderService.markSessionOrdersPaid(sessionId, paymentMethod || 'CASH');
        const orders = await this.orderService.getSessionOrders(sessionId);
        let invoice = null;
        if (orders.length > 0) {
            invoice = await this.invoiceService.createConsolidatedInvoiceForSession(session, orders);
        }
        await this.tableService.closeSessionInternal(shopId, sessionId);
        this.events.emitSessionUpdate(shopId, { type: 'SESSION_CLOSED', sessionId });
        return { message: 'Session Closed', invoice };
    }
    async getSessionDetails(shopId, sessionId) {
        const session = await this.tableService.getSessionById(sessionId);
        if (!session)
            throw new common_1.NotFoundException('Session not found');
        if (session.shopId !== shopId)
            throw new common_1.UnauthorizedException('Access denied');
        const orders = await this.orderService.getSessionOrders(sessionId);
        const totalAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0);
        return {
            session,
            orders,
            totalAmount,
            itemCount: orders.reduce((sum, o) => sum + (o.items?.length || 0), 0)
        };
    }
    async getSessionHistory(shopId, page = 1, limit = 20) {
        return this.tableService.getClosedSessions(shopId, page, limit);
    }
    async getActiveSessions(shopId) {
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
    async changeTable(shopId, sessionId, newTableId) {
        return this.tableService.changeTableSession(shopId, { sub: shopId, role: 'captain' }, {
            sessionId,
            newTableId
        });
    }
    async mergeTables(shopId, sessionId, tableIds) {
        return this.tableService.mergeTableSession(shopId, { sub: shopId, role: 'captain' }, {
            sessionId,
            tableIds
        });
    }
    async callWaiter(shopId, tableId, sessionId) {
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
        this.events.emitTableCall(shopId, {
            callId: call.id,
            tableId,
            tableNumber: call.table?.tableNumber,
            sessionId,
            createdAt: call.createdAt
        });
        return { message: 'Waiter called', call };
    }
    async resolveWaiterCall(shopId, callId) {
        const call = await this.prisma.waiterCall.findUnique({ where: { id: callId } });
        if (!call)
            throw new common_1.NotFoundException('Waiter call not found');
        if (call.shopId !== shopId)
            throw new common_1.UnauthorizedException('Access denied');
        const updated = await this.prisma.waiterCall.update({
            where: { id: callId },
            data: {
                status: 'RESOLVED',
                resolvedBy: shopId,
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
    async splitBill(shopId, sessionId, splits) {
        const session = await this.tableService.getSessionById(sessionId);
        if (!session)
            throw new common_1.NotFoundException('Session not found');
        if (session.shopId !== shopId)
            throw new common_1.UnauthorizedException('Access denied');
        if (splits < 2 || splits > 20)
            throw new common_1.BadRequestException('Splits must be between 2 and 20');
        const orders = await this.orderService.getSessionOrders(sessionId);
        const subtotal = orders.reduce((sum, o) => sum + o.subtotal, 0);
        const totalAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0);
        const totalTax = totalAmount - subtotal;
        const splitSubtotal = Math.round((subtotal / splits) * 100) / 100;
        const splitTax = Math.round((totalTax / splits) * 100) / 100;
        const splitTotal = Math.round((totalAmount / splits) * 100) / 100;
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
            items: orders.flatMap((o) => o.items || [])
        };
    }
    async printBill(shopId, sessionId) {
        const session = await this.tableService.getSessionById(sessionId);
        if (!session)
            throw new common_1.NotFoundException('Session not found');
        if (session.shopId !== shopId)
            throw new common_1.UnauthorizedException('Access denied');
        const shop = await this.shopService.getShopById(shopId);
        if (!shop)
            throw new common_1.NotFoundException('Shop not found');
        const orders = await this.orderService.getSessionOrders(sessionId);
        const allItems = [];
        orders.forEach((order) => {
            (order.items || []).forEach((item) => {
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
            tableNumber: session.table?.tableNumber || 'N/A',
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
    async getMenu(shopId) {
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
    async placeOrder(shopId, body) {
        const shop = await this.shopService.getShopById(shopId);
        if (!shop)
            throw new common_1.NotFoundException('Shop not found');
        const order = await this.orderService.placePOSOrder(shop.ownerId, {
            ...body,
            shopId
        });
        this.events.emitNewOrder(shopId, order);
        return order;
    }
    async voidItem(shopId, orderId, itemId, reason) {
        const order = await this.orderService.getOrderById(orderId);
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.shopId !== shopId)
            throw new common_1.UnauthorizedException('Access denied');
        await this.prisma.orderItem.delete({ where: { id: itemId } });
        const remainingItems = await this.prisma.orderItem.findMany({ where: { orderId } });
        const newSubtotal = remainingItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const taxRate = order.taxDetails?.rate
            ? parseFloat(String(order.taxDetails.rate).replace('%', ''))
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
    async modifyOrder(shopId, orderId, body) {
        const order = await this.orderService.getOrderById(orderId);
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.shopId !== shopId)
            throw new common_1.UnauthorizedException('Access denied');
        const result = await this.orderService.modifyOrder(orderId, body);
        this.events.emitOrderStatusUpdate(shopId, result);
        return result;
    }
};
exports.CaptainService = CaptainService;
exports.CaptainService = CaptainService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [shop_service_1.ShopService,
        order_service_1.OrderService,
        table_service_1.TableService,
        jwt_1.JwtService,
        invoice_service_1.InvoiceService,
        prisma_service_1.PrismaService,
        events_service_1.EventsService])
], CaptainService);
//# sourceMappingURL=captain.service.js.map