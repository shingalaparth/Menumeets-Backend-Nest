import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { AdminRepository } from '../domain/admin.repository';
import { Shop, Vendor, AdminBroadcast, FoodCourt } from '@prisma/client';

@Injectable()
export class AdminPrismaRepository implements AdminRepository {
    constructor(private prisma: PrismaService) { }

    async getGlobalStats(): Promise<any> {
        const [totalRevenue, totalOrders, shopCount, vendorCount, foodCourtCount] = await Promise.all([
            this.prisma.order.aggregate({
                where: { orderStatus: 'Completed' },
                _sum: { totalAmount: true }
            }),
            this.prisma.order.count({ where: { orderStatus: 'Completed' } }),
            this.prisma.shop.count({ where: { isActive: true } }),
            this.prisma.vendor.count(),
            this.prisma.foodCourt.count()
        ]);

        return {
            totalRevenue: totalRevenue._sum.totalAmount || 0,
            totalOrders,
            activeShops: shopCount,
            totalVendors: vendorCount,
            totalFoodCourts: foodCourtCount
        };
    }

    // Shops
    async getAllShops(skip = 0, take = 50): Promise<Shop[]> {
        return this.prisma.shop.findMany({
            skip,
            take,
            include: { owner: { select: { name: true, email: true, phone: true } }, foodCourt: { select: { name: true } } },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findShopById(id: string): Promise<Shop | null> {
        return this.prisma.shop.findUnique({
            where: { id },
            include: { owner: true, foodCourt: true }
        });
    }

    async updateShop(id: string, data: any): Promise<Shop> {
        return this.prisma.shop.update({
            where: { id },
            data
        });
    }

    async deleteShop(id: string): Promise<void> {
        await this.prisma.shop.delete({ where: { id } });
    }

    async countShops(): Promise<number> {
        return this.prisma.shop.count();
    }

    // Vendors
    async getAllVendors(skip = 0, take = 50): Promise<Vendor[]> {
        return this.prisma.vendor.findMany({
            skip,
            take,
            where: { role: { in: ['vendor', 'manager'] } },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findVendorById(id: string): Promise<Vendor | null> {
        return this.prisma.vendor.findUnique({ where: { id } });
    }

    async updateVendor(id: string, data: any): Promise<Vendor> {
        return this.prisma.vendor.update({
            where: { id },
            data
        });
    }

    async countVendors(): Promise<number> {
        return this.prisma.vendor.count({ where: { role: { in: ['vendor', 'manager'] } } });
    }

    // Broadcasts
    async createBroadcast(data: any): Promise<AdminBroadcast> {
        return this.prisma.adminBroadcast.create({ data });
    }

    async getBroadcasts(limit = 20): Promise<AdminBroadcast[]> {
        return this.prisma.adminBroadcast.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: { recipient: { select: { name: true } } }
        });
    }

    // Food Courts
    async getAllFoodCourts(): Promise<FoodCourt[]> {
        return this.prisma.foodCourt.findMany({
            include: { manager: { select: { name: true, email: true } }, shops: { select: { id: true } } }
        });
    }
}
