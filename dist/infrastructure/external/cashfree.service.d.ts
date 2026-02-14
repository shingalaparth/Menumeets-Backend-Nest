import { ConfigService } from '@nestjs/config';
export interface CashfreeOrderPayload {
    orderId: string;
    orderAmount: number;
    customerId: string;
    customerPhone: string;
    customerName: string;
    returnUrl: string;
    notifyUrl: string;
    orderTags?: Record<string, string>;
    splits?: Array<{
        vendor_id: string;
        amount: number;
    }>;
}
export interface CashfreeOrderResponse {
    paymentSessionId: string;
    cfOrderId: string;
}
export declare class CashfreeService {
    private configService;
    private readonly appId;
    private readonly secretKey;
    private readonly baseUrl;
    constructor(configService: ConfigService);
    createPaymentOrder(payload: CashfreeOrderPayload): Promise<CashfreeOrderResponse>;
    getPaymentStatus(cfOrderId: string): Promise<Record<string, unknown>>;
    createVendor(vendorData: any): Promise<any>;
}
