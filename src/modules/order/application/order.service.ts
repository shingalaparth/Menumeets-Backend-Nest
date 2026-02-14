import { Injectable, Inject, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ORDER_REPOSITORY, OrderRepository } from '../domain/order.repository';
import { CartService } from '../../cart/application/cart.service';
import { TableService } from '../../table/application/table.service';
import { NotificationService } from '../../notification/application/notification.service';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class OrderService {
    constructor(
        @Inject(ORDER_REPOSITORY) private repo: OrderRepository,
        private cartService: CartService,
        private tableService: TableService,
        private notificationService: NotificationService,
        private prisma: PrismaService
    ) { }

    // ──────────────────────────────────────
    // Core: Place Order (User)
    // ──────────────────────────────────────
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

        // 4. Calculate pricing
        const subtotal = cart.subtotal;
        const taxAmount = subtotal * 0.05; // 5% Tax
        const totalAmount = subtotal + taxAmount;

        const orderData = {
            shortOrderId,
            userId,
            shopId: cart.shopId,
            foodCourtId: cart.foodCourtId,
            tableId,
            orderType: body.orderType || 'Dining',
            orderStatus: 'Pending',
            subtotal,
            totalAmount,
            taxDetails: { taxAmount, rate: '5%' },
            paymentMethod: body.paymentMethod || 'COD',
            paymentStatus: body.paymentMethod === 'Online' ? 'UNPAID' : 'UNPAID',
            isPOS: false,
            customerDetails: body.customerDetails || null,
            notes: body.notes || null,
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
            const shop = await this.prisma.shop.findUnique({ where: { id: cart.shopId } });
            if (shop && shop.ownerId) {
                await this.notificationService.sendNotification({
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

    // ──────────────────────────────────────
    // Core: Place POS Order (Vendor/Captain)
    // ──────────────────────────────────────
    async placePOSOrder(vendorId: string, body: any) {
        const { shopId, items, tableId, tableSessionId, customerDetails, orderType, paymentMethod, notes } = body;

        if (!shopId) throw new BadRequestException('shopId is required');
        if (!items || items.length === 0) throw new BadRequestException('Items are required');

        // Verify shop ownership
        const shop = await this.prisma.shop.findUnique({ where: { id: shopId } });
        if (!shop) throw new NotFoundException('Shop not found');
        if (shop.ownerId !== vendorId) throw new ForbiddenException('Not your shop');

        const shortOrderId = await this.generateShortIds();

        // Calculate totals
        let subtotal = 0;
        const orderItems = items.map((item: any) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            return {
                menuItemId: item.menuItemId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                variant: item.variant || null,
                addOns: item.addOns || null
            };
        });

        // Apply tax from shop settings or default
        const taxRate = (shop.settings as any)?.tax?.rate || 5;
        const taxAmount = subtotal * (taxRate / 100);
        const totalAmount = subtotal + taxAmount;

        const orderData: any = {
            shortOrderId,
            shopId,
            tableId: tableId || null,
            tableSessionId: tableSessionId || null,
            orderType: orderType || 'Dining',
            orderStatus: 'Accepted', // POS orders auto-accept
            subtotal,
            totalAmount,
            taxDetails: { taxAmount, rate: `${taxRate}%` },
            paymentMethod: paymentMethod || 'CASH',
            paymentStatus: paymentMethod === 'CASH' ? 'PAID' : 'UNPAID',
            isPOS: true,
            customerDetails: customerDetails || null,
            notes: notes || null,
            items: {
                create: orderItems
            }
        };

        const order = await this.repo.createOrder(orderData);
        return order;
    }

    // ──────────────────────────────────────
    // Order Retrieval
    // ──────────────────────────────────────
    async getMyOrders(userId: string) {
        return this.repo.findByUserId(userId);
    }

    async getOrderById(orderId: string) {
        return this.repo.findById(orderId);
    }

    async getShopOrders(shopId: string, page = 1, limit = 20, filters?: any) {
        return this.repo.findByShopIdPaginated(shopId, page, limit, filters);
    }

    async getActiveOrders(shopId: string) {
        return this.repo.findActiveByShopId(shopId);
    }

    // ──────────────────────────────────────
    // Status Management
    // ──────────────────────────────────────
    async updateStatus(orderId: string, status: string) {
        const order = await this.repo.findById(orderId);
        if (!order) throw new NotFoundException('Order not found');

        // Validate status transition
        const validTransitions: Record<string, string[]> = {
            'Pending': ['Accepted', 'Rejected', 'Cancelled'],
            'Accepted': ['Preparing', 'Cancelled'],
            'Preparing': ['Ready', 'Cancelled'],
            'Ready': ['Completed'],
            'Payment Pending': ['Pending', 'Cancelled']
        };

        const allowed = validTransitions[order.orderStatus];
        if (allowed && !allowed.includes(status)) {
            throw new BadRequestException(
                `Cannot transition from ${order.orderStatus} to ${status}`
            );
        }

        const updated = await this.repo.updateStatus(orderId, status);

        // Notify User
        if (updated.userId) {
            await this.notificationService.sendNotification({
                userId: updated.userId,
                title: 'Order Status Updated',
                body: `Your order #${updated.shortOrderId} is now ${status}`,
                type: 'ORDER_STATUS',
                metadata: { orderId: updated.id, status }
            });
        }

        return updated;
    }

    async cancelOrder(orderId: string, cancelledBy: string, reason?: string) {
        const order = await this.repo.findById(orderId);
        if (!order) throw new NotFoundException('Order not found');

        const cancellableStatuses = ['Pending', 'Accepted', 'Payment Pending'];
        if (!cancellableStatuses.includes(order.orderStatus)) {
            throw new BadRequestException(
                `Order cannot be cancelled. Current status: ${order.orderStatus}`
            );
        }

        const updated = await this.repo.updateOrder(orderId, {
            orderStatus: 'Cancelled',
            notes: reason ? `Cancelled: ${reason}` : (order.notes || 'Cancelled')
        });

        // Notify the other party
        if (cancelledBy === 'user' && order.shopId) {
            const shop = await this.prisma.shop.findUnique({ where: { id: order.shopId } });
            if (shop) {
                await this.notificationService.sendNotification({
                    vendorId: shop.ownerId,
                    title: 'Order Cancelled',
                    body: `Order #${order.shortOrderId} has been cancelled by the customer`,
                    type: 'ORDER_CANCELLED',
                    metadata: { orderId: order.id }
                });
            }
        } else if (order.userId) {
            await this.notificationService.sendNotification({
                userId: order.userId,
                title: 'Order Cancelled',
                body: `Your order #${order.shortOrderId} has been cancelled${reason ? ': ' + reason : ''}`,
                type: 'ORDER_CANCELLED',
                metadata: { orderId: order.id }
            });
        }

        return updated;
    }

    async acceptPayAtCounterOrder(orderId: string, vendorId: string) {
        const order = await this.repo.findById(orderId);
        if (!order) throw new NotFoundException('Order not found');

        // Verify vendor owns the shop
        if (order.shopId) {
            const shop = await this.prisma.shop.findUnique({ where: { id: order.shopId } });
            if (!shop || shop.ownerId !== vendorId) {
                throw new ForbiddenException('Not authorized');
            }
        }

        if (order.paymentMethod !== 'COD' && order.paymentMethod !== 'PAY_AT_COUNTER') {
            throw new BadRequestException('This order is not a pay-at-counter order');
        }

        const updated = await this.repo.updateOrder(orderId, {
            orderStatus: 'Accepted',
            paymentStatus: 'PAID',
            paymentMethod: 'PAY_AT_COUNTER'
        });

        // Notify user
        if (order.userId) {
            await this.notificationService.sendNotification({
                userId: order.userId,
                title: 'Order Accepted',
                body: `Your order #${order.shortOrderId} has been accepted`,
                type: 'ORDER_STATUS',
                metadata: { orderId: order.id, status: 'Accepted' }
            });
        }

        return updated;
    }

    // ──────────────────────────────────────
    // Modify Order
    // ──────────────────────────────────────
    async modifyOrder(orderId: string, body: any) {
        const order = await this.repo.findById(orderId);
        if (!order) throw new NotFoundException('Order not found');

        const modifiableStatuses = ['Pending', 'Accepted'];
        if (!modifiableStatuses.includes(order.orderStatus)) {
            throw new BadRequestException(
                `Order cannot be modified. Current status: ${order.orderStatus}`
            );
        }

        const updateData: any = {};

        // Update items if provided
        if (body.items && body.items.length > 0) {
            // Delete existing items and recreate
            await this.prisma.orderItem.deleteMany({ where: { orderId } });

            let newSubtotal = 0;
            for (const item of body.items) {
                const itemTotal = item.price * item.quantity;
                newSubtotal += itemTotal;
                await this.repo.createOrderItem({
                    orderId,
                    menuItemId: item.menuItemId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    variant: item.variant || null,
                    addOns: item.addOns || null
                });
            }

            const taxRate = (order as any).taxDetails?.rate
                ? parseFloat(String((order as any).taxDetails.rate).replace('%', ''))
                : 5;
            const taxAmount = newSubtotal * (taxRate / 100);
            updateData.subtotal = newSubtotal;
            updateData.totalAmount = newSubtotal + taxAmount;
            updateData.taxDetails = { taxAmount, rate: `${taxRate}%` };
        }

        // Update other fields if provided
        if (body.notes !== undefined) updateData.notes = body.notes;
        if (body.orderType) updateData.orderType = body.orderType;

        if (Object.keys(updateData).length > 0) {
            return this.repo.updateOrder(orderId, updateData);
        }

        return this.repo.findById(orderId);
    }

    // ──────────────────────────────────────
    // Payment
    // ──────────────────────────────────────
    async updatePaymentStatus(orderId: string, status: string, details?: any) {
        return this.repo.updatePaymentStatus(orderId, status, details);
    }

    // ──────────────────────────────────────
    // KOT & Session Helpers (Used by Captain)
    // ──────────────────────────────────────
    async getKOTOrders(shopId: string) {
        return this.repo.findKOTOrders(shopId);
    }

    async getSessionTotals(sessionIds: string[]): Promise<Record<string, number>> {
        const totals: Record<string, number> = {};
        for (const sessionId of sessionIds) {
            const sessionOrders = await this.getSessionOrders(sessionId);
            const total = sessionOrders.reduce((sum, order) => sum + order.totalAmount, 0);
            totals[sessionId] = total;
        }
        return totals;
    }

    async getSessionOrders(sessionId: string) {
        return this.repo.findByTableSessionId(sessionId);
    }

    async markSessionOrdersPaid(sessionId: string, paymentMethod: string) {
        const orders = await this.getSessionOrders(sessionId);
        for (const order of orders) {
            if (order.paymentStatus !== 'PAID') {
                await this.repo.updatePaymentStatus(order.id, 'PAID', { paymentMethod });
                await this.repo.updateStatus(order.id, 'Completed');
            }
        }
    }

    // ──────────────────────────────────────
    // Reorder Previous Order
    // ──────────────────────────────────────
    async reorderPrevious(userId: string, orderId: string) {
        const originalOrder = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true }
        });

        if (!originalOrder) throw new NotFoundException('Order not found');
        if (originalOrder.userId !== userId) throw new ForbiddenException('Not your order');

        if (!originalOrder.items || originalOrder.items.length === 0) {
            throw new BadRequestException('Original order has no items to reorder');
        }

        // Verify all menu items are still available
        const menuItemIds = originalOrder.items.map(item => item.menuItemId);
        const availableItems = await this.prisma.menuItem.findMany({
            where: { id: { in: menuItemIds }, isAvailable: true, isArchived: false }
        });
        const availableIds = new Set(availableItems.map(i => i.id));

        const reorderItems = originalOrder.items
            .filter(item => availableIds.has(item.menuItemId))
            .map(item => ({
                menuItemId: item.menuItemId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                variant: item.variant,
                addOns: item.addOns
            }));

        if (reorderItems.length === 0) {
            throw new BadRequestException('None of the original items are currently available');
        }

        const shortOrderId = await this.generateShortIds();
        const subtotal = reorderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const taxAmount = subtotal * 0.05;
        const totalAmount = subtotal + taxAmount;

        const newOrder = await this.repo.createOrder({
            shortOrderId,
            userId,
            shopId: originalOrder.shopId,
            foodCourtId: originalOrder.foodCourtId,
            tableId: originalOrder.tableId,
            orderType: originalOrder.orderType,
            orderStatus: 'Pending',
            subtotal,
            totalAmount,
            taxDetails: { taxAmount, rate: '5%' },
            paymentMethod: originalOrder.paymentMethod,
            paymentStatus: 'UNPAID',
            isPOS: false,
            notes: null,
            items: { create: reorderItems }
        });

        return {
            order: newOrder,
            unavailableItems: originalOrder.items
                .filter(item => !availableIds.has(item.menuItemId))
                .map(item => item.name)
        };
    }

    // ──────────────────────────────────────
    // Order Notes
    // ──────────────────────────────────────
    async updateOrderNote(orderId: string, note: string) {
        const order = await this.repo.findById(orderId);
        if (!order) throw new NotFoundException('Order not found');
        return this.repo.updateOrder(orderId, { notes: note });
    }

    // ──────────────────────────────────────
    // Analytics
    // ──────────────────────────────────────
    async getOrderAnalytics(shopId: string, duration?: string) {
        const now = new Date();
        let startDate = new Date();

        if (duration === 'today') {
            startDate.setHours(0, 0, 0, 0);
        } else if (duration === 'week') {
            startDate.setDate(now.getDate() - 7);
        } else if (duration === 'month') {
            startDate.setMonth(now.getMonth() - 1);
        } else {
            startDate.setHours(0, 0, 0, 0); // Default to today
        }

        return this.repo.getAnalytics(shopId, startDate, now);
    }

    // ──────────────────────────────────────
    // Parity: Update Item Quantity (Patch)
    // ──────────────────────────────────────
    async updateOrderItemQuantity(orderId: string, itemId: string, quantity: number) {
        if (quantity < 0) throw new BadRequestException('Quantity cannot be negative');

        const order = await this.repo.findById(orderId);
        if (!order) throw new NotFoundException('Order not found');

        // Allow updates only in certain statuses
        const modifiableStatuses = ['Pending', 'Accepted', 'Payment Pending'];
        if (!modifiableStatuses.includes(order.orderStatus)) {
            throw new BadRequestException(`Cannot update order in ${order.orderStatus} state`);
        }

        if (quantity === 0) {
            // If quantity is 0, remove item
            await this.prisma.orderItem.delete({ where: { id: itemId } });
        } else {
            // Update quantity
            await this.repo.updateOrderItemQuantity(orderId, itemId, quantity);
        }

        // Recalculate Totals
        const items = await this.prisma.orderItem.findMany({ where: { orderId } });
        if (items.length === 0) {
            // Auto-cancel if empty? Or just set totals to 0
            await this.repo.updateOrder(orderId, { subtotal: 0, totalAmount: 0, taxDetails: { taxAmount: 0, rate: '5%' } });
            return this.repo.findById(orderId);
        }

        let newSubtotal = 0;
        for (const item of items) {
            newSubtotal += item.price * item.quantity;
        }

        // Fetch tax rate from existing order snapshot or shop settings
        // For parity, we use the existing snapshot rate if available, else default 5%
        const taxRateStr = (order as any).taxDetails?.rate || '5%';
        const taxRate = parseFloat(taxRateStr.replace('%', ''));
        const taxAmount = newSubtotal * (taxRate / 100);

        const updated = await this.repo.updateOrder(orderId, {
            subtotal: newSubtotal,
            totalAmount: newSubtotal + taxAmount,
            taxDetails: { taxAmount, rate: `${taxRate}%` }
        });

        // Emit update
        if (order.shopId) {
            this.notificationService.sendNotification({
                vendorId: (order as any).shop?.ownerId, // This might need a fetch if shop relation not loaded
                title: 'Order Updated',
                body: `Order #${order.shortOrderId} updated`,
                type: 'ORDER_UPDATE',
                metadata: { orderId: order.id }
            });
            // We should use EventsService here but avoiding circular dep if not injected.
            // NotificationService handles basic pushes.
        }

        return updated;
    }

    // ──────────────────────────────────────
    // Helpers
    // ──────────────────────────────────────
    private async generateShortIds() {
        // 6-char alphanumeric
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }
}
