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
exports.KOTService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const shop_service_1 = require("../../shop/application/shop.service");
const order_service_1 = require("../../order/application/order.service");
let KOTService = class KOTService {
    constructor(shopService, orderService, jwtService) {
        this.shopService = shopService;
        this.orderService = orderService;
        this.jwtService = jwtService;
    }
    async login(shopId, pin) {
        if (!shopId || !pin) {
            throw new common_1.BadRequestException('Shop ID and PIN are required');
        }
        const shop = await this.shopService.getShopById(shopId);
        if (!shop)
            throw new common_1.NotFoundException('Shop not found');
        if (!shop.kotPin || String(shop.kotPin) !== String(pin)) {
            throw new common_1.UnauthorizedException('Invalid KOT PIN');
        }
        const payload = { sub: shop.id, role: 'kot', name: shop.name };
        const token = this.jwtService.sign(payload);
        return {
            success: true,
            token,
            shop: {
                id: shop.id,
                name: shop.name,
                features: shop.settings?.featureAccess
            }
        };
    }
    async getOrders(shopId) {
        return this.orderService.getKOTOrders(shopId);
    }
    async updateOrderStatus(shopId, orderId, status) {
        const allowed = ['Preparing', 'Ready', 'Completed'];
        if (!allowed.includes(status)) {
            throw new common_1.BadRequestException('Invalid KOT status');
        }
        const order = await this.orderService.getOrderById(orderId);
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.shopId !== shopId)
            throw new common_1.UnauthorizedException('Access denied');
        return this.orderService.updateStatus(orderId, status);
    }
};
exports.KOTService = KOTService;
exports.KOTService = KOTService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [shop_service_1.ShopService,
        order_service_1.OrderService,
        jwt_1.JwtService])
], KOTService);
//# sourceMappingURL=kot.service.js.map