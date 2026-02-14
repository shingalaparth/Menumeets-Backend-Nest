import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { ORDER_REPOSITORY, OrderRepository } from '../domain/order.repository';
import { CartService } from '../../cart/application/cart.service';
import { TableService } from '../../table/application/table.service';
import { NotificationService } from '../../notification/application/notification.service';
import { PrismaService } from '../../../infrastructure/database/prisma.service'; // Needed to fetch shop owner

@Injectable()
export class OrderService {
    constructor(
        @Inject(ORDER_REPOSITORY) private repo: OrderRepository,
        private cartService: CartService,
        private tableService: TableService,
        private notificationService: NotificationService,
        private prisma: PrismaService
    ) { }

    async placeOrder(userId: string, body: any) {
        // 1. Get Cart
        const cart = await this.cartService.getCart(userId);
        if (!cart || cart.items.length === 0) {
            throw new BadRequestException('Cart is empty');
        }

        // 2. Validate Table (if provided)
        let tableId = body.tableId;
        if (body.qrIdentifier) {
            const table = await this.tableService.findTableByQr(body.qrIdentifier);
            if (table) tableId = table.id;
        }

        // 3. Prepare Order Data
        const shortOrderId = await this.generateShortIds();
        // const orderId = `ORD-${Date.now()}`; // Temp ID, Prisma uses UUID usually, but we might want custom ID logic?
        // Prisma schema says id is uuid. shortOrderId is unique string.

        // 4. Create Order
        // We need to map Cart items to Order items
        // And calculate tax, totals.
        // Assuming Cart has subtotal.
        const subtotal = cart.subtotal;
        const taxAmount = subtotal * 0.05; // Mock 5% Tax
        const totalAmount = subtotal + taxAmount;

        const orderData = {
            shortOrderId,
            userId,
            shopId: cart.shopId,
            foodCourtId: cart.foodCourtId,
            tableId,
            // tableSessionId: ... (Managed by TableService when session starts?)
            orderType: body.orderType || 'Dining',
            orderStatus: 'Pending',
            subtotal,
            totalAmount,
            taxDetails: { taxAmount, rate: '5%' }, // Snapshot
            paymentMethod: body.paymentMethod || 'COD',
            paymentStatus: 'UNPAID',
            isPOS: false,
            items: {
                create: cart.items.map((item: any) => ({
                    menuItemId: item.menuItemId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    variant: item.variant,
                    addOns: item.addOns
                }))
            }
        };

        const order = await this.repo.createOrder(orderData);

        // 5. Clear Cart
        await this.cartService.clearCart(userId);

        // 6. Notify Shop Owner
        if (cart.shopId) {
            // Optimization: Fetch shop once or cache
            const shop = await this.prisma.shop.findUnique({ where: { id: cart.shopId } });
            if (shop && shop.ownerId) {
                await this.notificationService.sendNotification({
                    userId: shop.ownerId, // Vendor is user in notification logic? Or VendorId? NotificationService handles "userId" or "vendorId".
                    // NotificationService logic: userId -> sendToUser, vendorId -> sendToUser.
                    // Assuming shop.ownerId (Vendor) should be passed as vendorId or userId depending on how gateway handles it.
                    // Looking at NotificationService:
                    // if (data.userId) this.gateway.sendToUser(data.userId...)
                    // if (data.vendorId) this.gateway.sendToUser(data.vendorId...)
                    // So both work. Vendor IDs are UUIDs.
                    vendorId: shop.ownerId,
                    title: 'New Order Received',
                    body: `Order #${order.shortOrderId} placed. Total: ₹${totalAmount}`,
                    type: 'ORDER_NEW',
                    metadata: { orderId: order.id, shopId: cart.shopId }
                });
            }
        }

        return order;
    }

    async getMyOrders(userId: string) {
        return this.repo.findByUserId(userId);
    }

    async getOrderById(orderId: string) {
        return this.repo.findById(orderId);
    }

    async updateStatus(orderId: string, status: string) {
        const order = await this.repo.updateStatus(orderId, status);

        // Notify User
        if (order.userId) {
            await this.notificationService.sendNotification({
                userId: order.userId,
                title: 'Order Status Updated',
                body: `Your order #${order.shortOrderId} is now ${status}`,
                type: 'ORDER_STATUS',
                metadata: { orderId: order.id, status }
            });
        }
        return order;
    }

    async updatePaymentStatus(orderId: string, status: string, details?: any) {
        return this.repo.updatePaymentStatus(orderId, status, details);
    }

    async getKOTOrders(shopId: string) {
        return this.repo.findKOTOrders(shopId);
    }

    async getSessionTotals(sessionIds: string[]): Promise<Record<string, number>> {
        // This likely needs a custom repo method "aggregateSessionTotals"
        // For now, fetch all orders by these sessions and aggregate in memory (simplest)
        // Or if Repo has it. Repo does not have it.
        // I'll add a quick robust way:
        const totals: Record<string, number> = {};
        for (const sessionId of sessionIds) {
            // This is N+1 but efficient enough for low N active sessions
            // Better: findOrdersBySessionIds(ids)
            // Let's mock it purely via loop for MVP
            const sessionOrders = await this.getSessionOrders(sessionId); // Use service method
            const total = sessionOrders.reduce((sum, order) => sum + order.totalAmount, 0);
            totals[sessionId] = total;
        }
        return totals;
    }

    async getSessionOrders(sessionId: string) {
        // Need repo method
        return this.repo.findByTableSessionId(sessionId);
    }

    async markSessionOrdersPaid(sessionId: string, paymentMethod: string) {
        // Need repo updateMany or loop
        const orders = await this.getSessionOrders(sessionId);
        for (const order of orders) {
            if (order.paymentStatus !== 'PAID') {
                await this.repo.updatePaymentStatus(order.id, 'PAID', { paymentMethod });
                await this.repo.updateStatus(order.id, 'Completed');
            }
        }
    }

    private async generateShortIds() {
        // Simple random 6 chars
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }
}
