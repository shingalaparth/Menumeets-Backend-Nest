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
let CaptainService = class CaptainService {
    constructor(shopService, orderService, tableService, jwtService, invoiceService) {
        this.shopService = shopService;
        this.orderService = orderService;
        this.tableService = tableService;
        this.jwtService = jwtService;
        this.invoiceService = invoiceService;
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
        return {
            tables,
            activeSessions: activeSessions.map(s => ({
                ...s,
                totalAmount: totals[s.id] || 0
            }))
        };
    }
    async startSession(shopId, data) {
        return this.tableService.startSessionInternal(shopId, data);
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
        return { message: 'Session Closed', invoice };
    }
};
exports.CaptainService = CaptainService;
exports.CaptainService = CaptainService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [shop_service_1.ShopService,
        order_service_1.OrderService,
        table_service_1.TableService,
        jwt_1.JwtService,
        invoice_service_1.InvoiceService])
], CaptainService);
//# sourceMappingURL=captain.service.js.map