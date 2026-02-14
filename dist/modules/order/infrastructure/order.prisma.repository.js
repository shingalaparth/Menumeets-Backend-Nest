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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderPrismaRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../infrastructure/database/prisma.service");
let OrderPrismaRepository = class OrderPrismaRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createOrder(data) {
        return this.prisma.order.create({ data });
    }
    async createOrderItem(data) {
        return this.prisma.orderItem.create({ data });
    }
    async findById(orderId) {
        return this.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true, user: true, shop: true, table: true }
        });
    }
    async findByShortId(shortOrderId) {
        return this.prisma.order.findUnique({
            where: { shortOrderId },
            include: { items: true }
        });
    }
    async updateStatus(orderId, orderStatus) {
        return this.prisma.order.update({
            where: { id: orderId },
            data: { orderStatus }
        });
    }
    async updatePaymentStatus(orderId, paymentStatus, paymentDetails) {
        return this.prisma.order.update({
            where: { id: orderId },
            data: {
                paymentStatus,
                ...paymentDetails
            }
        });
    }
    async findByUserId(userId) {
        return this.prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: { items: true, shop: true }
        });
    }
    async findByShopId(shopId) {
        return this.prisma.order.findMany({
            where: { shopId },
            orderBy: { createdAt: 'desc' },
            include: { items: true, user: true }
        });
    }
    async findKOTOrders(shopId) {
        return this.prisma.order.findMany({
            where: {
                shopId,
                orderStatus: { in: ['Accepted', 'Placed', 'Preparing', 'Ready'] }
            },
            orderBy: { createdAt: 'asc' },
            include: { items: true, user: true }
        });
    }
    async findByTableSessionId(sessionId) {
        return this.prisma.order.findMany({
            where: { tableSessionId: sessionId },
            include: { items: { include: { menuItem: true } } }
        });
    }
};
exports.OrderPrismaRepository = OrderPrismaRepository;
exports.OrderPrismaRepository = OrderPrismaRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrderPrismaRepository);
//# sourceMappingURL=order.prisma.repository.js.map