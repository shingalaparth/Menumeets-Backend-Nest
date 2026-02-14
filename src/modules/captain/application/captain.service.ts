import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ShopService } from '../../shop/application/shop.service';
import { OrderService } from '../../order/application/order.service';
import { TableService } from '../../table/application/table.service';
import { InvoiceService } from '../../invoice/application/invoice.service';

@Injectable()
export class CaptainService {
    constructor(
        private shopService: ShopService,
        private orderService: OrderService,
        private tableService: TableService,
        private jwtService: JwtService,
        private invoiceService: InvoiceService
    ) { }

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

    async getDashboard(shopId: string) {
        // 1. Get Tables (Bypass vendor check or use internal)
        const tables = await this.tableService.getTablesForShopInternal(shopId);

        // 2. Get Active Sessions
        // activeSessions are part of table logic, handled by TableService
        const activeSessions = await this.tableService.getActiveSessions(shopId);

        // 3. Get Order Totals for sessions
        const sessionIds = activeSessions.map(s => s.id);
        const totals = await this.orderService.getSessionTotals(sessionIds);

        return {
            tables,
            activeSessions: activeSessions.map(s => ({
                ...s,
                totalAmount: totals[s.id] || 0
            }))
        };
    }

    async startSession(shopId: string, data: any) {
        // Use internal method to bypass vendor check
        return this.tableService.startSessionInternal(shopId, data);
    }

    async closeSession(shopId: string, sessionId: string, paymentMethod: string) {
        // 1. Get Session
        const session = await this.tableService.getSessionById(sessionId);
        if (!session) throw new NotFoundException('Session not found');
        if (session.shopId !== shopId) throw new UnauthorizedException('Access denied');

        // 2. Pay all unpaid orders
        await this.orderService.markSessionOrdersPaid(sessionId, paymentMethod || 'CASH');

        // 3. Get all orders for invoice
        const orders = await this.orderService.getSessionOrders(sessionId);

        // 4. Generate Invoice
        let invoice = null;
        if (orders.length > 0) {
            invoice = await this.invoiceService.createConsolidatedInvoiceForSession(session, orders);
        }

        // 5. Close Session
        await this.tableService.closeSessionInternal(shopId, sessionId);

        return { message: 'Session Closed', invoice };
    }
}
