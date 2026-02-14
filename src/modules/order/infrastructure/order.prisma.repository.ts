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
        const data: any = { orderStatus };
        if (orderStatus === 'Completed') {
            data.completedAt = new Date();
        }
        return this.prisma.order.update({
            where: { id: orderId },
            data
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
            include: { items: { include: { menuItem: true } } }
        });
    }

    // ── Parity additions ──

    async findActiveByShopId(shopId: string) {
        return this.prisma.order.findMany({
            where: {
                shopId,
                orderStatus: { in: ['Pending', 'Accepted', 'Preparing', 'Ready'] }
            },
            orderBy: { createdAt: 'desc' },
            include: { items: true, user: true, table: true }
        });
    }

    async updateOrder(orderId: string, data: any) {
        return this.prisma.order.update({
            where: { id: orderId },
            data,
            include: { items: true, user: true, shop: true }
        });
    }

    async findByShopIdPaginated(shopId: string, page: number, limit: number, filters?: any) {
        const where: any = { shopId };

        if (filters?.status) {
            where.orderStatus = filters.status;
        }
        if (filters?.paymentStatus) {
            where.paymentStatus = filters.paymentStatus;
        }
        if (filters?.orderType) {
            where.orderType = filters.orderType;
        }
        if (filters?.startDate || filters?.endDate) {
            where.createdAt = {};
            if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
            if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
        }

        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                include: { items: true, user: true, table: true }
            }),
            this.prisma.order.count({ where })
        ]);

        return { orders, total };
    }

    // ── Analytics ──
    async getAnalytics(shopId: string, startDate: Date, endDate: Date): Promise<any> {
        const where = {
            shopId,
            createdAt: { gte: startDate, lte: endDate },
            orderStatus: 'Completed'
        };

        const [aggregates, count] = await Promise.all([
            this.prisma.order.aggregate({
                where,
                _sum: { totalAmount: true },
                _avg: { totalAmount: true }
            }),
            this.prisma.order.count({ where })
        ]);

        const cancelledCount = await this.prisma.order.count({
            where: {
                shopId,
                createdAt: { gte: startDate, lte: endDate },
                orderStatus: 'Cancelled'
            }
        });

        return {
            totalRevenue: aggregates._sum.totalAmount || 0,
            totalOrders: count,
            averageOrderValue: aggregates._avg.totalAmount || 0,
            cancelledOrders: cancelledCount
        };
    }

    async updateOrderItemQuantity(orderId: string, itemId: string, quantity: number): Promise<any> {
        return this.prisma.orderItem.update({
            where: { id: itemId },
            data: { quantity }
        });
    }
}
