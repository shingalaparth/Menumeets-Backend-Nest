import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { OrderRepository } from '../domain/order.repository';

@Injectable()
export class OrderPrismaRepository implements OrderRepository {
    constructor(private prisma: PrismaService) { }

    async createOrder(data: any) {
        return this.prisma.order.create({ data });
    }

    async createOrderItem(data: any) {
        return this.prisma.orderItem.create({ data });
    }

    async findById(orderId: string) {
        return this.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true, user: true, shop: true, table: true }
        });
    }

    async findByShortId(shortOrderId: string) {
        return this.prisma.order.findUnique({
            where: { shortOrderId },
            include: { items: true }
        });
    }

    async updateStatus(orderId: string, orderStatus: string) {
        return this.prisma.order.update({
            where: { id: orderId },
            data: { orderStatus }
        });
    }

    async updatePaymentStatus(orderId: string, paymentStatus: string, paymentDetails?: any) {
        return this.prisma.order.update({
            where: { id: orderId },
            data: {
                paymentStatus,
                ...paymentDetails // razorpay/cashfree details
            }
        });
    }

    async findByUserId(userId: string) {
        return this.prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: { items: true, shop: true }
        });
    }

    async findByShopId(shopId: string) {
        return this.prisma.order.findMany({
            where: { shopId },
            orderBy: { createdAt: 'desc' },
            include: { items: true, user: true }
        });
    }

    async findKOTOrders(shopId: string) {
        return this.prisma.order.findMany({
            where: {
                shopId,
                orderStatus: { in: ['Accepted', 'Placed', 'Preparing', 'Ready'] }
            },
            orderBy: { createdAt: 'asc' }, // Oldest first for KOT
            include: { items: true, user: true }
        });
    }

    async findByTableSessionId(sessionId: string) {
        return this.prisma.order.findMany({
            where: { tableSessionId: sessionId },
            include: { items: { include: { menuItem: true } } } // Include items details
        });
    }
}
