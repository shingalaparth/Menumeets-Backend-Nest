import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { AdminRepository } from '../domain/admin.repository';
import { Shop, Vendor, AdminBroadcast, FoodCourt, Order, User, SystemConfig } from '@prisma/client';

@Injectable()
export class AdminPrismaRepository implements AdminRepository {
    constructor(private prisma: PrismaService) { }

    async getGlobalStats(): Promise<any> {
        const [totalRevenue, totalOrders, shopCount, vendorCount, foodCourtCount, userCount, pendingOrders] = await Promise.all([
            this.prisma.order.aggregate({
                where: { orderStatus: 'Completed' },
                _sum: { totalAmount: true }
            }),
            this.prisma.order.count({ where: { orderStatus: 'Completed' } }),
            this.prisma.shop.count({ where: { isActive: true } }),
            this.prisma.vendor.count(),
            this.prisma.foodCourt.count(),
            this.prisma.user.count(),
            this.prisma.order.count({ where: { orderStatus: 'Pending' } })
        ]);

        return {
            totalRevenue: totalRevenue._sum.totalAmount || 0,
            totalOrders,
            activeShops: shopCount,
            totalVendors: vendorCount,
            totalFoodCourts: foodCourtCount,
            totalUsers: userCount,
            pendingOrders
        };
    }

    // ── Shops ──
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
            include: {
                owner: true,
                foodCourt: true,
                categories: { include: { menuItems: true } },
                tables: true,
                _count: { select: { orders: true, reviews: true } }
            }
        });
    }

    async updateShop(id: string, data: any): Promise<Shop> {
        return this.prisma.shop.update({ where: { id }, data });
    }

    async deleteShop(id: string): Promise<void> {
        await this.prisma.shop.delete({ where: { id } });
    }

    async countShops(): Promise<number> {
        return this.prisma.shop.count();
    }

    // ── Vendors ──
    async getAllVendors(skip = 0, take = 50): Promise<Vendor[]> {
        return this.prisma.vendor.findMany({
            skip,
            take,
            where: { role: { in: ['vendor', 'manager'] } },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findVendorById(id: string): Promise<Vendor | null> {
        return this.prisma.vendor.findUnique({
            where: { id },
            include: { shops: { select: { id: true, name: true, isActive: true } } }
        });
    }

    async updateVendor(id: string, data: any): Promise<Vendor> {
        return this.prisma.vendor.update({ where: { id }, data });
    }

    async deleteVendor(id: string): Promise<void> {
        await this.prisma.vendor.delete({ where: { id } });
    }

    async countVendors(): Promise<number> {
        return this.prisma.vendor.count({ where: { role: { in: ['vendor', 'manager'] } } });
    }

    // ── Broadcasts ──
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

    // ── Food Courts ──
    async getAllFoodCourts(): Promise<FoodCourt[]> {
        return this.prisma.foodCourt.findMany({
            include: { manager: { select: { name: true, email: true } }, shops: { select: { id: true } } }
        });
    }

    // ── Orders (Parity) ──
    async getAllOrders(skip = 0, take = 50, filters?: any): Promise<{ orders: Order[]; total: number }> {
        const where: any = {};
        if (filters?.status) where.orderStatus = filters.status;
        if (filters?.shopId) where.shopId = filters.shopId;
        if (filters?.startDate || filters?.endDate) {
            where.createdAt = {};
            if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
            if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
        }

        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                include: { items: true, user: true, shop: { select: { name: true } } }
            }),
            this.prisma.order.count({ where })
        ]);

        return { orders, total };
    }

    async findOrderById(id: string): Promise<Order | null> {
        return this.prisma.order.findUnique({
            where: { id },
            include: { items: true, user: true, shop: true, table: true }
        });
    }

    async updateOrderStatus(id: string, status: string): Promise<Order> {
        return this.prisma.order.update({
            where: { id },
            data: { orderStatus: status }
        });
    }

    // ── Users (Parity) ──
    async getAllUsers(skip = 0, take = 50): Promise<{ users: User[]; total: number }> {
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                select: { id: true, name: true, email: true, phone: true, createdAt: true }
            }),
            this.prisma.user.count()
        ]);

        return { users: users as any, total };
    }

    async findUserById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
            include: { orders: { take: 10, orderBy: { createdAt: 'desc' } } }
        });
    }

    // ── System Config (Parity) ──
    async getSystemConfigs(): Promise<SystemConfig[]> {
        return this.prisma.systemConfig.findMany({
            orderBy: { key: 'asc' }
        });
    }

    async upsertSystemConfig(key: string, value: any, description?: string): Promise<SystemConfig> {
        return this.prisma.systemConfig.upsert({
            where: { key },
            update: { value, description },
            create: { key, value, description }
        });
    }

    // ── Reports (Parity) ──
    async getRevenueReport(startDate: Date, endDate: Date): Promise<any> {
        const [totalRevenue, ordersByDay, ordersByShop] = await Promise.all([
            this.prisma.order.aggregate({
                where: {
                    orderStatus: 'Completed',
                    createdAt: { gte: startDate, lte: endDate }
                },
                _sum: { totalAmount: true },
                _count: true
            }),
            this.prisma.order.groupBy({
                by: ['createdAt'],
                where: {
                    orderStatus: 'Completed',
                    createdAt: { gte: startDate, lte: endDate }
                },
                _sum: { totalAmount: true },
                _count: true
            }),
            this.prisma.order.groupBy({
                by: ['shopId'],
                where: {
                    orderStatus: 'Completed',
                    createdAt: { gte: startDate, lte: endDate }
                },
                _sum: { totalAmount: true },
                _count: true
            })
        ]);

        return {
            totalRevenue: totalRevenue._sum.totalAmount || 0,
            totalOrders: totalRevenue._count,
            dailyBreakdown: ordersByDay,
            shopBreakdown: ordersByShop
        };
    }

    async getTopSellingItems(limit = 10, startDate?: Date, endDate?: Date): Promise<any[]> {
        const where: any = {};
        if (startDate || endDate) {
            where.order = { createdAt: {} };
            if (startDate) where.order.createdAt.gte = startDate;
            if (endDate) where.order.createdAt.lte = endDate;
        }

        const items = await this.prisma.orderItem.groupBy({
            by: ['menuItemId', 'name'],
            where,
            _sum: { quantity: true },
            _count: true,
            orderBy: { _sum: { quantity: 'desc' } },
            take: limit
        });

        return items.map(item => ({
            menuItemId: item.menuItemId,
            name: item.name,
            totalQuantity: item._sum.quantity,
            orderCount: item._count
        }));
    }
}
