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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const cashfree_service_1 = require("../../../infrastructure/external/cashfree.service");
const order_service_1 = require("../../order/application/order.service");
const shop_service_1 = require("../../shop/application/shop.service");
let PaymentService = class PaymentService {
    constructor(cashfree, orderService, shopService) {
        this.cashfree = cashfree;
        this.orderService = orderService;
        this.shopService = shopService;
    }
    async createVendor(shopId, body, vendor) {
        const shop = await this.shopService.getShopById(shopId);
        if (!shop)
            throw new common_1.NotFoundException('Shop not found');
        const vendorId = `VEN_${shopId}_${Date.now()}`;
        const request = {
            vendor_id: vendorId,
            status: "ACTIVE",
            name: body.name,
            email: body.email,
            phone: body.phone,
            verify_account_status: true,
            settle_cycle_id: 2,
            bank_details: {
                account_holder: body.name,
                account_number: body.bankAccount,
                ifsc: body.ifsc
            }
        };
        try {
            const data = await this.cashfree.createVendor(request);
            await this.shopService.updateShop(shopId, vendor, {
                cashfreeVendorId: vendorId,
                cashfreeOnboardingStatus: 'active'
            });
            return { success: true, data };
        }
        catch (e) {
            console.error('Vendor Create Error', e.response?.data || e);
            throw new common_1.BadRequestException(e.response?.data?.message || 'Vendor creation failed');
        }
    }
    async createPaymentOrder(userId, orderId) {
        const order = await this.orderService.getOrderById(orderId);
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.paymentStatus === 'PAID')
            throw new common_1.BadRequestException('Order already paid');
        const shop = order.shop;
        if (!shop)
            throw new common_1.BadRequestException('Shop not found in order');
        if (!shop.cashfreeVendorId)
            throw new common_1.BadRequestException('Shop payout not setup');
        const platformCommission = shop.settings?.profile?.platformCommission ?? 1;
        const totalAmount = Number(order.totalAmount);
        const commissionAmount = (totalAmount * platformCommission) / 100;
        const vendorAmount = totalAmount - commissionAmount;
        const splits = [{
                vendor_id: shop.cashfreeVendorId,
                amount: Number(vendorAmount.toFixed(2))
            }];
        const payload = {
            orderId: order.id,
            orderAmount: totalAmount,
            customerId: order.userId || 'Guest',
            customerPhone: order.customerDetails?.phone || '9999999999',
            customerName: order.customerDetails?.name || 'Guest',
            returnUrl: `http://localhost:5173/orders?order_id=${order.id}`,
            notifyUrl: `https://menumeets-backend.ngrok-free.app/api/payment/webhook`,
            splits
        };
        const response = await this.cashfree.createPaymentOrder(payload);
        await this.orderService.updatePaymentStatus(order.id, 'UNPAID', {
            razorpayOrderId: response.cfOrderId,
            cashfreeOrderId: response.cfOrderId,
            cashfreePaymentId: response.paymentSessionId
        });
        return response;
    }
    async verifyPayment(orderId) {
        const order = await this.orderService.getOrderById(orderId);
        if (!order || !order.cashfreeOrderId)
            throw new common_1.NotFoundException('Order not valid for verification');
        const statusData = await this.cashfree.getPaymentStatus(order.cashfreeOrderId);
        const orderStatus = statusData.order_status;
        if (orderStatus === 'PAID') {
            if (order.paymentStatus !== 'PAID') {
                await this.orderService.updatePaymentStatus(order.id, 'PAID');
                await this.orderService.updateStatus(order.id, 'Accepted');
            }
            return { success: true, status: 'PAID' };
        }
        return { success: false, status: orderStatus };
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cashfree_service_1.CashfreeService,
        order_service_1.OrderService,
        shop_service_1.ShopService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map