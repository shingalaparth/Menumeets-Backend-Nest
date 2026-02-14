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
            paymentStatus: 'UNPAID',
            isPOS: false,
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
                    userId: shop.ownerId,
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
    async getMyOrders(userId) {
        return this.repo.findByUserId(userId);
    }
    async getOrderById(orderId) {
        return this.repo.findById(orderId);
    }
    async updateStatus(orderId, status) {
        const order = await this.repo.updateStatus(orderId, status);
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