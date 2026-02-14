"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const order_repository_1 = require("../domain/order.repository");
const cart_service_1 = require("../../cart/application/cart.service");
const table_service_1 = require("../../table/application/table.service");
const notification_service_1 = require("../../notification/application/notification.service");
const prisma_service_1 = require("../../../infrastructure/database/prisma.service");
let OrderService = class OrderService {
    constructor(repo, cartService, tableService, notificationService, prisma) {
        this.repo = repo;
        this.cartService = cartService;
        this.tableService = tableService;
        this.notificationService = notificationService;
        this.prisma = prisma;
    }
    async placeOrder(userId, body) {
        const cart = await this.cartService.getCart(userId);
        if (!cart || cart.items.length === 0) {
            throw new common_1.BadRequestException('Cart is empty');
        }
        let tableId = body.tableId;
        if (body.qrIdentifier) {
            const table = await this.tableService.findTableByQr(body.qrIdentifier);
            if (table)
                tableId = table.id;
        }
        const shortOrderId = await this.generateShortIds();
        const subtotal = cart.subtotal;
        const taxAmount = subtotal * 0.05;
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
                create: cart.items.map((item) => ({
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
        await this.cartService.clearCart(userId);
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
    async placePOSOrder(vendorId, body) {
        const { shopId, items, tableId, tableSessionId, customerDetails, orderType, paymentMethod, notes } = body;
        if (!shopId)
            throw new common_1.BadRequestException('shopId is required');
        if (!items || items.length === 0)
            throw new common_1.BadRequestException('Items are required');
        const shop = await this.prisma.shop.findUnique({ where: { id: shopId } });
        if (!shop)
            throw new common_1.NotFoundException('Shop not found');
        if (shop.ownerId !== vendorId)
            throw new common_1.ForbiddenException('Not your shop');
        const shortOrderId = await this.generateShortIds();
        let subtotal = 0;
        const orderItems = items.map((item) => {
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
        const taxRate = shop.settings?.tax?.rate || 5;
        const taxAmount = subtotal * (taxRate / 100);
        const totalAmount = subtotal + taxAmount;
        const orderData = {
            shortOrderId,
            shopId,
            tableId: tableId || null,
            tableSessionId: tableSessionId || null,
            orderType: orderType || 'Dining',
            orderStatus: 'Accepted',
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
    async getMyOrders(userId) {
        return this.repo.findByUserId(userId);
    }
    async getOrderById(orderId) {
        return this.repo.findById(orderId);
    }
    async getShopOrders(shopId, page = 1, limit = 20, filters) {
        return this.repo.findByShopIdPaginated(shopId, page, limit, filters);
    }
    async getActiveOrders(shopId) {
        return this.repo.findActiveByShopId(shopId);
    }
    async updateStatus(orderId, status) {
        const order = await this.repo.findById(orderId);
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        const validTransitions = {
            'Pending': ['Accepted', 'Rejected', 'Cancelled'],
            'Accepted': ['Preparing', 'Cancelled'],
            'Preparing': ['Ready', 'Cancelled'],
            'Ready': ['Completed'],
            'Payment Pending': ['Pending', 'Cancelled']
        };
        const allowed = validTransitions[order.orderStatus];
        if (allowed && !allowed.includes(status)) {
            throw new common_1.BadRequestException(`Cannot transition from ${order.orderStatus} to ${status}`);
        }
        const updated = await this.repo.updateStatus(orderId, status);
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
    async cancelOrder(orderId, cancelledBy, reason) {
        const order = await this.repo.findById(orderId);
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        const cancellableStatuses = ['Pending', 'Accepted', 'Payment Pending'];
        if (!cancellableStatuses.includes(order.orderStatus)) {
            throw new common_1.BadRequestException(`Order cannot be cancelled. Current status: ${order.orderStatus}`);
        }
        const updated = await this.repo.updateOrder(orderId, {
            orderStatus: 'Cancelled',
            notes: reason ? `Cancelled: ${reason}` : (order.notes || 'Cancelled')
        });
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
        }
        else if (order.userId) {
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
    async acceptPayAtCounterOrder(orderId, vendorId) {
        const order = await this.repo.findById(orderId);
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.shopId) {
            const shop = await this.prisma.shop.findUnique({ where: { id: order.shopId } });
            if (!shop || shop.ownerId !== vendorId) {
                throw new common_1.ForbiddenException('Not authorized');
            }
        }
        if (order.paymentMethod !== 'COD' && order.paymentMethod !== 'PAY_AT_COUNTER') {
            throw new common_1.BadRequestException('This order is not a pay-at-counter order');
        }
        const updated = await this.repo.updateOrder(orderId, {
            orderStatus: 'Accepted',
            paymentStatus: 'PAID',
            paymentMethod: 'PAY_AT_COUNTER'
        });
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
    async modifyOrder(orderId, body) {
        const order = await this.repo.findById(orderId);
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        const modifiableStatuses = ['Pending', 'Accepted'];
        if (!modifiableStatuses.includes(order.orderStatus)) {
            throw new common_1.BadRequestException(`Order cannot be modified. Current status: ${order.orderStatus}`);
        }
        const updateData = {};
        if (body.items && body.items.length > 0) {
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
            const taxRate = order.taxDetails?.rate
                ? parseFloat(String(order.taxDetails.rate).replace('%', ''))
                : 5;
            const taxAmount = newSubtotal * (taxRate / 100);
            updateData.subtotal = newSubtotal;
            updateData.totalAmount = newSubtotal + taxAmount;
            updateData.taxDetails = { taxAmount, rate: `${taxRate}%` };
        }
        if (body.notes !== undefined)
            updateData.notes = body.notes;
        if (body.orderType)
            updateData.orderType = body.orderType;
        if (Object.keys(updateData).length > 0) {
            return this.repo.updateOrder(orderId, updateData);
        }
        return this.repo.findById(orderId);
    }
    async updatePaymentStatus(orderId, status, details) {
        return this.repo.updatePaymentStatus(orderId, status, details);
    }
    async getKOTOrders(shopId) {
        return this.repo.findKOTOrders(shopId);
    }
    async getSessionTotals(sessionIds) {
        const totals = {};
        for (const sessionId of sessionIds) {
            const sessionOrders = await this.getSessionOrders(sessionId);
            const total = sessionOrders.reduce((sum, order) => sum + order.totalAmount, 0);
            totals[sessionId] = total;
        }
        return totals;
    }
    async getSessionOrders(sessionId) {
        return this.repo.findByTableSessionId(sessionId);
    }
    async markSessionOrdersPaid(sessionId, paymentMethod) {
        const orders = await this.getSessionOrders(sessionId);
        for (const order of orders) {
            if (order.paymentStatus !== 'PAID') {
                await this.repo.updatePaymentStatus(order.id, 'PAID', { paymentMethod });
                await this.repo.updateStatus(order.id, 'Completed');
            }
        }
    }
    async reorderPrevious(userId, orderId) {
        const originalOrder = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true }
        });
        if (!originalOrder)
            throw new common_1.NotFoundException('Order not found');
        if (originalOrder.userId !== userId)
            throw new common_1.ForbiddenException('Not your order');
        if (!originalOrder.items || originalOrder.items.length === 0) {
            throw new common_1.BadRequestException('Original order has no items to reorder');
        }
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
            throw new common_1.BadRequestException('None of the original items are currently available');
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
    async updateOrderNote(orderId, note) {
        const order = await this.repo.findById(orderId);
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return this.repo.updateOrder(orderId, { notes: note });
    }
    async getOrderAnalytics(shopId, duration) {
        const now = new Date();
        let startDate = new Date();
        if (duration === 'today') {
            startDate.setHours(0, 0, 0, 0);
        }
        else if (duration === 'week') {
            startDate.setDate(now.getDate() - 7);
        }
        else if (duration === 'month') {
            startDate.setMonth(now.getMonth() - 1);
        }
        else {
            startDate.setHours(0, 0, 0, 0);
        }
        return this.repo.getAnalytics(shopId, startDate, now);
    }
    async updateOrderItemQuantity(orderId, itemId, quantity) {
        if (quantity < 0)
            throw new common_1.BadRequestException('Quantity cannot be negative');
        const order = await this.repo.findById(orderId);
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        const modifiableStatuses = ['Pending', 'Accepted', 'Payment Pending'];
        if (!modifiableStatuses.includes(order.orderStatus)) {
            throw new common_1.BadRequestException(`Cannot update order in ${order.orderStatus} state`);
        }
        if (quantity === 0) {
            await this.prisma.orderItem.delete({ where: { id: itemId } });
        }
        else {
            await this.repo.updateOrderItemQuantity(orderId, itemId, quantity);
        }
        const items = await this.prisma.orderItem.findMany({ where: { orderId } });
        if (items.length === 0) {
            await this.repo.updateOrder(orderId, { subtotal: 0, totalAmount: 0, taxDetails: { taxAmount: 0, rate: '5%' } });
            return this.repo.findById(orderId);
        }
        let newSubtotal = 0;
        for (const item of items) {
            newSubtotal += item.price * item.quantity;
        }
        const taxRateStr = order.taxDetails?.rate || '5%';
        const taxRate = parseFloat(taxRateStr.replace('%', ''));
        const taxAmount = newSubtotal * (taxRate / 100);
        const updated = await this.repo.updateOrder(orderId, {
            subtotal: newSubtotal,
            totalAmount: newSubtotal + taxAmount,
            taxDetails: { taxAmount, rate: `${taxRate}%` }
        });
        if (order.shopId) {
            this.notificationService.sendNotification({
                vendorId: order.shop?.ownerId,
                title: 'Order Updated',
                body: `Order #${order.shortOrderId} updated`,
                type: 'ORDER_UPDATE',
                metadata: { orderId: order.id }
            });
        }
        return updated;
    }
    async generateShortIds() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(order_repository_1.ORDER_REPOSITORY)),
    __metadata("design:paramtypes", [Object, cart_service_1.CartService,
        table_service_1.TableService,
        notification_service_1.NotificationService,
        prisma_service_1.PrismaService])
], OrderService);
//# sourceMappingURL=order.service.js.map