import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CashfreeService } from '../../../infrastructure/external/cashfree.service';
import { OrderService } from '../../order/application/order.service';
import { ShopService } from '../../shop/application/shop.service';

@Injectable()
export class PaymentService {
    constructor(
        private cashfree: CashfreeService,
        private orderService: OrderService,
        private shopService: ShopService
    ) { }

    async createVendor(shopId: string, body: any, vendor: any) {
        const shop = await this.shopService.getShopById(shopId);
        if (!shop) throw new NotFoundException('Shop not found');

        // Ownership check is handled by shopService.updateShop which we call below.
        // Or we could call checkOwnership here. 
        // shopService.updateShop checks ownership internally.

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
            // Update Shop
            await this.shopService.updateShop(shopId, vendor, {
                cashfreeVendorId: vendorId,
                cashfreeOnboardingStatus: 'active'
            });
            return { success: true, data };
        } catch (e: any) {
            console.error('Vendor Create Error', e.response?.data || e);
            throw new BadRequestException(e.response?.data?.message || 'Vendor creation failed');
        }
    }

    async createPaymentOrder(userId: string, orderId: string) {
        // 1. Fetch Order
        const order = await this.orderService.getOrderById(orderId);
        if (!order) throw new NotFoundException('Order not found');
        if (order.paymentStatus === 'PAID') throw new BadRequestException('Order already paid');

        // Simplified Single Shop Logic
        // Note: Repository findById usually includes Shop if we set it up that way.
        // Let's assume order.shop is available or fetch it.
        // The current OrderPrismaRepository.findById includes 'shop'.

        const shop = (order as any).shop;
        if (!shop) throw new BadRequestException('Shop not found in order');

        if (!shop.cashfreeVendorId) throw new BadRequestException('Shop payout not setup');

        // Platform Fee Logic (Mock)
        const platformCommission = (shop.settings as any)?.profile?.platformCommission ?? 1;
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
            customerPhone: (order as any).customerDetails?.phone || '9999999999',
            customerName: (order as any).customerDetails?.name || 'Guest',
            returnUrl: `http://localhost:5173/orders?order_id=${order.id}`,
            notifyUrl: `https://menumeets-backend.ngrok-free.app/api/payment/webhook`,
            splits
        };

        // Call Cashfree
        const response = await this.cashfree.createPaymentOrder(payload);

        // Update Order
        await this.orderService.updatePaymentStatus(order.id, 'UNPAID', {
            razorpayOrderId: response.cfOrderId,
            cashfreeOrderId: response.cfOrderId,
            cashfreePaymentId: response.paymentSessionId
        });

        return response;
    }

    async verifyPayment(orderId: string) {
        const order = await this.orderService.getOrderById(orderId);
        if (!order || !(order as any).cashfreeOrderId) throw new NotFoundException('Order not valid for verification');

        const statusData = await this.cashfree.getPaymentStatus((order as any).cashfreeOrderId);
        // Cast check to string
        const orderStatus = statusData.order_status as string;

        if (orderStatus === 'PAID') {
            if (order.paymentStatus !== 'PAID') {
                await this.orderService.updatePaymentStatus(order.id, 'PAID');
                await this.orderService.updateStatus(order.id, 'Accepted');
            }
            return { success: true, status: 'PAID' };
        }
        return { success: false, status: orderStatus };
    }
}
