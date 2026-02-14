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
}
