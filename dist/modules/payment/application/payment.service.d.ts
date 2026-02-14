import { CashfreeService } from '../../../infrastructure/external/cashfree.service';
import { OrderService } from '../../order/application/order.service';
import { ShopService } from '../../shop/application/shop.service';
export declare class PaymentService {
    private cashfree;
    private orderService;
    private shopService;
    constructor(cashfree: CashfreeService, orderService: OrderService, shopService: ShopService);
    createVendor(shopId: string, body: any, vendor: any): Promise<{
        success: boolean;
        data: any;
    }>;
    createPaymentOrder(userId: string, orderId: string): Promise<import("../../../infrastructure/external/cashfree.service").CashfreeOrderResponse>;
    verifyPayment(orderId: string): Promise<{
        success: boolean;
        status: string;
    }>;
    handleWebhook(webhookBody: any, rawBody: string, signature: string): Promise<{
        success: boolean;
        message: string;
        status?: undefined;
    } | {
        success: boolean;
        status: any;
        message?: undefined;
    }>;
    initiateRefund(orderId: string, amount: number, reason: string): Promise<{
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
