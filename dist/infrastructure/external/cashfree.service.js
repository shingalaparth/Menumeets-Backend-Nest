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
exports.CashfreeService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let CashfreeService = class CashfreeService {
    constructor(configService) {
        this.configService = configService;
        this.appId = (this.configService.get('cashfree.appId') || '').trim();
        this.secretKey = (this.configService.get('cashfree.secretKey') || '').trim();
        const environment = this.configService.get('cashfree.environment', 'SANDBOX');
        this.baseUrl =
            environment === 'PRODUCTION'
                ? 'https://api.cashfree.com/pg'
                : 'https://sandbox.cashfree.com/pg';
    }
    async createPaymentOrder(payload) {
        const cfPayload = {
            order_id: `MM_${payload.orderId}_${Date.now()}`,
            order_amount: payload.orderAmount.toFixed(2),
            order_currency: 'INR',
            customer_details: {
                customer_id: payload.customerId,
                customer_phone: payload.customerPhone,
                customer_name: payload.customerName,
            },
            order_meta: {
                return_url: payload.returnUrl,
                notify_url: payload.notifyUrl,
            },
            order_tags: payload.orderTags || {},
        };
        if (payload.splits && payload.splits.length > 0) {
            cfPayload.order_splits = payload.splits;
        }
        const response = await axios_1.default.post(`${this.baseUrl}/orders`, cfPayload, {
            headers: {
                'Content-Type': 'application/json',
                'x-client-id': this.appId,
                'x-client-secret': this.secretKey,
                'x-api-version': '2023-08-01',
            },
        });
        return {
            paymentSessionId: response.data.payment_session_id,
            cfOrderId: response.data.order_id || response.data.cf_order_id,
        };
    }
    async getPaymentStatus(cfOrderId) {
        const response = await axios_1.default.get(`${this.baseUrl}/orders/${cfOrderId}`, {
            headers: {
                'x-client-id': this.appId,
                'x-client-secret': this.secretKey,
                'x-api-version': '2023-08-01',
            },
        });
        return response.data;
    }
    async createVendor(vendorData) {
        const response = await axios_1.default.post(`${this.baseUrl}/easy-split/vendors`, vendorData, {
            headers: {
                'x-client-id': this.appId,
                'x-client-secret': this.secretKey,
                'x-api-version': '2023-08-01',
            },
        });
        return response.data;
    }
};
exports.CashfreeService = CashfreeService;
exports.CashfreeService = CashfreeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CashfreeService);
//# sourceMappingURL=cashfree.service.js.map