/**
 * Cashfree Service — migrated from old config/cashfree.js + utils/paymentUtils.js
 *
 * Old: Cashfree SDK init + initializeCashfreePayment() utility
 * New: Injectable service with same payment initialization logic
 *
 * NOTE: The full initializeCashfreePayment() logic (order lookup, split calculation)
 * depends on Order/Shop models which aren't migrated yet.
 * This service provides the low-level Cashfree API interaction.
 * The order-level payment logic will live in modules/payment/application/ later.
 */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface CashfreeOrderPayload {
    orderId: string;
    orderAmount: number;
    customerId: string;
    customerPhone: string;
    customerName: string;
    returnUrl: string;
    notifyUrl: string;
    orderTags?: Record<string, string>;
    splits?: Array<{ vendor_id: string; amount: number }>;
}

export interface CashfreeOrderResponse {
    paymentSessionId: string;
    cfOrderId: string;
}

@Injectable()
export class CashfreeService {
    private readonly appId: string;
    private readonly secretKey: string;
    private readonly baseUrl: string;

    constructor(private configService: ConfigService) {
        this.appId = (this.configService.get<string>('cashfree.appId') || '').trim();
        this.secretKey = (this.configService.get<string>('cashfree.secretKey') || '').trim();

        const environment = this.configService.get<string>('cashfree.environment', 'SANDBOX');
        this.baseUrl =
            environment === 'PRODUCTION'
                ? 'https://api.cashfree.com/pg'
                : 'https://sandbox.cashfree.com/pg';
    }

    /**
     * Create a Cashfree payment order
     * Replaces the core API call from old utils/paymentUtils.js
     */
    async createPaymentOrder(payload: CashfreeOrderPayload): Promise<CashfreeOrderResponse> {
        const cfPayload: Record<string, unknown> = {
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

        const response = await axios.post(`${this.baseUrl}/orders`, cfPayload, {
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

    /**
     * Verify payment status with Cashfree
     */
    async getPaymentStatus(cfOrderId: string): Promise<Record<string, unknown>> {
        const response = await axios.get(`${this.baseUrl}/orders/${cfOrderId}`, {
            headers: {
                'x-client-id': this.appId,
                'x-client-secret': this.secretKey,
                'x-api-version': '2023-08-01',
            },
        });

        return response.data;
    }

    /**
     * Create/Onboard a Vendor in Cashfree
     */
    async createVendor(vendorData: any): Promise<any> {
        const response = await axios.post(`${this.baseUrl}/easy-split/vendors`, vendorData, {
            headers: {
                'x-client-id': this.appId,
                'x-client-secret': this.secretKey,
                'x-api-version': '2023-08-01',
            },
        });
        return response.data;
    }
}
