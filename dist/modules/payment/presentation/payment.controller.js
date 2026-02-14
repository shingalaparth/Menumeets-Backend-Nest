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
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("../application/payment.service");
const user_auth_guard_1 = require("../../../shared/guards/user-auth.guard");
const vendor_auth_guard_1 = require("../../../shared/guards/vendor-auth.guard");
const current_user_decorator_1 = require("../../../shared/decorators/current-user.decorator");
let PaymentController = class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async createVendor(shopId, body, vendor) {
        return this.paymentService.createVendor(shopId, body, vendor);
    }
    async createPaymentOrder(user, body) {
        return this.paymentService.createPaymentOrder(user.id, body.orderId);
    }
    async verifyPayment(body) {
        return this.paymentService.verifyPayment(body.orderId);
    }
    async handleWebhook(req) {
        const rawBody = req.rawBody?.toString();
        const signature = req.headers['x-webhook-signature'];
        return this.paymentService.handleWebhook(req.body, rawBody, signature);
    }
    async refundOrder(orderId, body) {
        const { amount, reason } = body;
        return this.paymentService.initiateRefund(orderId, amount, reason);
    }
    async getVendorStatus(shopId) {
        return this.paymentService.getVendorStatus(shopId);
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)('vendor/:shopId'),
    (0, common_1.UseGuards)(vendor_auth_guard_1.VendorAuthGuard),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createVendor", null);
__decorate([
    (0, common_1.Post)('create-order'),
    (0, common_1.UseGuards)(user_auth_guard_1.UserAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createPaymentOrder", null);
__decorate([
    (0, common_1.Post)('verify'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "verifyPayment", null);
__decorate([
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "handleWebhook", null);
__decorate([
    (0, common_1.Post)('refund/:orderId'),
    (0, common_1.UseGuards)(vendor_auth_guard_1.VendorAuthGuard),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "refundOrder", null);
__decorate([
    (0, common_1.Get)('vendor-status/:shopId'),
    (0, common_1.UseGuards)(vendor_auth_guard_1.VendorAuthGuard),
    __param(0, (0, common_1.Param)('shopId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getVendorStatus", null);
exports.PaymentController = PaymentController = __decorate([
    (0, common_1.Controller)('payment'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map