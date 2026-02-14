import { PaymentService } from '../application/payment.service';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    createVendor(shopId: string, body: any, vendor: any): Promise<{
        success: boolean;
        data: any;
    }>;
    createPaymentOrder(user: any, body: any): Promise<import("../../../infrastructure/external/cashfree.service").CashfreeOrderResponse>;
    verifyPayment(body: any): Promise<{
        success: boolean;
        status: string;
    }>;
    handleWebhook(req: any): Promise<{
        success: boolean;
        message: string;
        status?: undefined;
    } | {
        success: boolean;
        status: any;
        message?: undefined;
    }>;
    refundOrder(orderId: string, body: any): Promise<{
        success: boolean;
        refundId: string;
        data: any;
    }>;
    getVendorStatus(shopId: string): Promise<{
        onboarded: boolean;
        status: string;
        message: string;
        vendorId?: undefined;
        details?: undefined;
        error?: undefined;
    } | {
        onboarded: boolean;
        status: any;
        vendorId: any;
        details: any;
        message?: undefined;
        error?: undefined;
    } | {
        onboarded: boolean;
        status: string;
        vendorId: any;
        error: any;
        message?: undefined;
        details?: undefined;
    }>;
}
