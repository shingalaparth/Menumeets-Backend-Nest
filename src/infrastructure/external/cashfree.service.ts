/**
 * Cashfree Service
 */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';

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

    /**
     * Get Vendor Status from Cashfree
     */
    async getVendorStatus(vendorId: string): Promise<any> {
        const response = await axios.get(`${this.baseUrl}/easy-split/vendors/${vendorId}`, {
            headers: {
                'x-client-id': this.appId,
                'x-client-secret': this.secretKey,
                'x-api-version': '2023-08-01',
            },
        });
        return response.data;
    }

    /**
     * Verify Webhook Signature
     */
    verifySignature(signature: string, rawBody: string): boolean {
        // Cashfree signature is base64 encoded HMAC-SHA256 of the raw body
        const computedSignature = crypto
            .createHmac('sha256', this.secretKey)
            .update(rawBody)
            .digest('base64');

        return computedSignature === signature;
    }

    /**
     * Create Refund
     */
    async createRefund(orderId: string, amount: number, refundId: string): Promise<any> {
        const response = await axios.post(`${this.baseUrl}/orders/${orderId}/refunds`, {
            refund_amount: amount,
            refund_id: refundId,
        }, {
            headers: {
                'x-api-version': '2023-08-01',
                'x-client-id': this.appId,
                'x-client-secret': this.secretKey,
            }
        });
        return response.data;
    }
}
