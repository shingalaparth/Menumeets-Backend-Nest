import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { FoodCourtRepository } from '../domain/food-court.repository';
import { FoodCourt } from '@prisma/client';

@Injectable()
export class FoodCourtPrismaRepository implements FoodCourtRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: any): Promise<FoodCourt> {
        return this.prisma.foodCourt.create({ data });
    }

    async findById(id: string): Promise<FoodCourt | null> {
        return this.prisma.foodCourt.findUnique({
            where: { id },
            include: { shops: true, manager: true }
        });
    }

    async update(id: string, data: any): Promise<FoodCourt> {
        return this.prisma.foodCourt.update({
            where: { id },
            data,
            include: { shops: true }
        });
    }

    async addShop(foodCourtId: string, shopId: string): Promise<void> {
        await this.prisma.shop.update({
            where: { id: shopId },
            data: { foodCourtId }
        });
    }

    async removeShop(foodCourtId: string, shopId: string): Promise<void> {
        await this.prisma.shop.update({
            where: { id: shopId },
            data: { foodCourtId: null }
        });
    }

    async getAnalytics(foodCourtId: string, duration: string): Promise<any> {
        // 1. Get all shop IDs
        const shops = await this.prisma.shop.findMany({
            where: { foodCourtId },
            select: { id: true, name: true }
        });
        const shopIds = shops.map(s => s.id);

        if (shopIds.length === 0) return { totalRevenue: 0, totalOrders: 0, shopsPerformance: [] };

        // 2. Date Range
        const now = new Date();
        let startDate = new Date(0);
        if (duration === 'day') startDate = new Date(now.setHours(0, 0, 0, 0));
        if (duration === 'week') startDate = new Date(now.setDate(now.getDate() - 7));
        if (duration === 'month') startDate = new Date(now.setMonth(now.getMonth() - 1));

        // 3. Aggregate
        const aggregations = await this.prisma.order.groupBy({
            by: ['shopId'],
            where: {
                shopId: { in: shopIds },
                orderStatus: 'Completed',
                createdAt: { gte: startDate }
            },
            _sum: { totalAmount: true },
            _count: { id: true }
        });

        // 4. Map
        const shopsPerformance = shops.map(shop => {
            const agg = aggregations.find(a => a.shopId === shop.id);
            return {
                id: shop.id,
                name: shop.name,
                revenue: agg ? (agg._sum.totalAmount || 0) : 0,
                orders: agg ? agg._count.id : 0
            };
        }).sort((a, b) => b.revenue - a.revenue);

        const totalRevenue = shopsPerformance.reduce((sum, item) => sum + item.revenue, 0);
        const totalOrders = shopsPerformance.reduce((sum, item) => sum + item.orders, 0);

        return {
            totalRevenue,
            totalOrders,
            totalShops: shops.length,
            shopsPerformance
        };
    }

    async getShops(foodCourtId: string): Promise<any[]> {
        const fc = await this.prisma.foodCourt.findUnique({
            where: { id: foodCourtId },
            include: { shops: true }
        });
        return fc ? fc.shops : [];
    }

    async findAll(): Promise<FoodCourt[]> {
        return this.prisma.foodCourt.findMany({
            include: { shops: true, manager: true }
        });
    }
}
