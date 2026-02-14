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
        status: string;
    }>;
}
