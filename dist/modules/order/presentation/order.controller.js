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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("../application/order.service");
const user_auth_guard_1 = require("../../../shared/guards/user-auth.guard");
const vendor_auth_guard_1 = require("../../../shared/guards/vendor-auth.guard");
const universal_auth_guard_1 = require("../../../shared/guards/universal-auth.guard");
const current_user_decorator_1 = require("../../../shared/decorators/current-user.decorator");
let OrderController = class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    async placeOrder(user, body) {
        return this.orderService.placeOrder(user.id, body);
    }
    async getMyOrders(user) {
        return this.orderService.getMyOrders(user.id);
    }
    async getOrderById(id) {
        return this.orderService.getOrderById(id);
    }
    async reorderPrevious(user, orderId) {
        return this.orderService.reorderPrevious(user.id, orderId);
    }
    async updateOrderNote(id, note) {
        return this.orderService.updateOrderNote(id, note);
    }
    async placePOSOrder(req, body) {
        return this.orderService.placePOSOrder(req.vendor.id, body);
    }
    async getShopOrders(shopId, page, limit, status) {
        const filters = status ? { orderStatus: status } : undefined;
        return this.orderService.getShopOrders(shopId, parseInt(page || '1'), parseInt(limit || '20'), filters);
    }
    async getActiveOrders(shopId) {
        return this.orderService.getActiveOrders(shopId);
    }
    async updateStatus(id, status) {
        return this.orderService.updateStatus(id, status);
    }
    async cancelOrder(id, req, reason) {
        const cancelledBy = req.user?.role || 'user';
        return this.orderService.cancelOrder(id, cancelledBy, reason);
    }
    async modifyOrder(id, body) {
        return this.orderService.modifyOrder(id, body);
    }
    async acceptPayAtCounter(id, req) {
        return this.orderService.acceptPayAtCounterOrder(id, req.vendor.id);
    }
    async getShopAnalytics(shopId, duration) {
        return this.orderService.getOrderAnalytics(shopId, duration);
    }
    async updateOrderItemQuantity(orderId, itemId, quantity) {
        return this.orderService.updateOrderItemQuantity(orderId, itemId, quantity);
    }
    async getKOTOrders(shopId) {
        return this.orderService.getKOTOrders(shopId);
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(user_auth_guard_1.UserAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "placeOrder", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(user_auth_guard_1.UserAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getMyOrders", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(universal_auth_guard_1.UniversalAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrderById", null);
__decorate([
    (0, common_1.Post)('reorder/:orderId'),
    (0, common_1.UseGuards)(user_auth_guard_1.UserAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "reorderPrevious", null);
__decorate([
    (0, common_1.Patch)(':id/notes'),
    (0, common_1.UseGuards)(universal_auth_guard_1.UniversalAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('note')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "updateOrderNote", null);
__decorate([
    (0, common_1.Post)('pos'),
    (0, common_1.UseGuards)(vendor_auth_guard_1.VendorAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "placePOSOrder", null);
__decorate([
    (0, common_1.Get)('shop/:shopId'),
    (0, common_1.UseGuards)(vendor_auth_guard_1.VendorAuthGuard),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getShopOrders", null);
__decorate([
    (0, common_1.Get)('shop/:shopId/active'),
    (0, common_1.UseGuards)(vendor_auth_guard_1.VendorAuthGuard),
    __param(0, (0, common_1.Param)('shopId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getActiveOrders", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, common_1.UseGuards)(vendor_auth_guard_1.VendorAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, common_1.UseGuards)(universal_auth_guard_1.UniversalAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "cancelOrder", null);
__decorate([
    (0, common_1.Patch)(':id/modify'),
    (0, common_1.UseGuards)(vendor_auth_guard_1.VendorAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "modifyOrder", null);
__decorate([
    (0, common_1.Post)(':id/accept-counter'),
    (0, common_1.UseGuards)(vendor_auth_guard_1.VendorAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "acceptPayAtCounter", null);
__decorate([
    (0, common_1.Get)('shop/:shopId/analytics'),
    (0, common_1.UseGuards)(vendor_auth_guard_1.VendorAuthGuard),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, common_1.Query)('duration')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getShopAnalytics", null);
__decorate([
    (0, common_1.Patch)(':id/items/:itemId'),
    (0, common_1.UseGuards)(vendor_auth_guard_1.VendorAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, common_1.Body)('quantity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "updateOrderItemQuantity", null);
__decorate([
    (0, common_1.Get)('kot/:shopId'),
    (0, common_1.UseGuards)(vendor_auth_guard_1.VendorAuthGuard),
    __param(0, (0, common_1.Param)('shopId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getKOTOrders", null);
exports.OrderController = OrderController = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
//# sourceMappingURL=order.controller.js.map