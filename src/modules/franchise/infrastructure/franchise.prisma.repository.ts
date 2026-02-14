import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { FranchiseRepository } from '../domain/franchise.repository';
import { Franchise } from '@prisma/client';

@Injectable()
export class FranchisePrismaRepository implements FranchiseRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: any): Promise<Franchise> {
        return this.prisma.franchise.create({ data });
    }

    async findById(id: string): Promise<Franchise | null> {
        return this.prisma.franchise.findUnique({
            where: { id },
            include: { shops: true, owner: true }
        });
    }

    async findByOwnerId(ownerId: string): Promise<Franchise | null> {
        return this.prisma.franchise.findUnique({
            where: { ownerId },
            include: { shops: true }
        });
    }

    async update(id: string, data: any): Promise<Franchise> {
        return this.prisma.franchise.update({
            where: { id },
            data,
            include: { shops: true }
        });
    }

    async addShop(franchiseId: string, shopId: string): Promise<void> {
        await this.prisma.shop.update({
            where: { id: shopId },
            data: { franchiseId }
        });
    }

    async removeShop(franchiseId: string, shopId: string): Promise<void> {
        // Verify shop belongs to franchise before removing?
        await this.prisma.shop.update({
            where: { id: shopId },
            data: { franchiseId: null }
        });
    }

    async getOutlets(franchiseId: string): Promise<any[]> {
        const franchise = await this.prisma.franchise.findUnique({
            where: { id: franchiseId },
            include: { shops: true }
        });
        return franchise ? franchise.shops : [];
    }

    async addManager(franchiseId: string, vendorId: string, body: any): Promise<any> {
        // We need to fetch the vendor and update their franchiseRoles JSON
        const vendor = await this.prisma.vendor.findUnique({ where: { id: vendorId } });
        if (!vendor) throw new Error('Vendor not found');

        const role = {
            franchise: franchiseId,
            role: 'franchise_manager',
            regions: body.regions || [],
            assignedShops: body.assignedShops || [],
            permissions: body.permissions || {}
        };

        const currentRoles = (vendor.franchiseRoles as any[]) || [];
        // Check if already exists
        const exists = currentRoles.find((r: any) => r.franchise === franchiseId);
        if (exists) throw new Error('Vendor is already a manager for this franchise');

        return this.prisma.vendor.update({
            where: { id: vendorId },
            data: {
                franchiseRoles: [...currentRoles, role]
            }
        });
    }

    async removeManager(franchiseId: string, vendorId: string): Promise<any> {
        const vendor = await this.prisma.vendor.findUnique({ where: { id: vendorId } });
        if (!vendor) throw new Error('Vendor not found');

        const currentRoles = (vendor.franchiseRoles as any[]) || [];
        const newRoles = currentRoles.filter((r: any) => r.franchise !== franchiseId);

        return this.prisma.vendor.update({
            where: { id: vendorId },
            data: { franchiseRoles: newRoles }
        });
    }

    async getManagers(franchiseId: string): Promise<any[]> {
        // Since franchiseRoles is JSON, we can't easily query inside it with basic Prisma unless we use raw query or fetch all vendors.
        // Fetching all vendors is bad.
        // But `path` query is supported in Postgres JSONB.
        // Prisma `array_contains` might work if structure matches.
        // Current safe bet: Use `findMany` with `where` on JSON path if supported, OR raw query.
        // Prisma supports JSON filtering:
        // https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/working-with-json-fields#filter-on-json-arrays
        // However, filtering inside an array of objects is tricky.
        // Let's use Raw Query for performance and correctness.

        const vendors = await this.prisma.$queryRaw`
            SELECT id, name, email, "number", "franchise_roles"
            FROM "vendors"
            WHERE "franchise_roles"::jsonb @> ${JSON.stringify([{ franchise: franchiseId }])}::jsonb
        `;
        return vendors as any[];
    }

    async getAnalytics(franchiseId: string, duration: string): Promise<any> {
        // 1. Get all shop IDs for this franchise
        const shops = await this.prisma.shop.findMany({
            where: { franchiseId },
            select: { id: true, name: true }
        });
        const shopIds = shops.map(s => s.id);

        if (shopIds.length === 0) return { totalRevenue: 0, totalOrders: 0, outletPerformance: [] };

        // 2. Calculate Date Range
        const now = new Date();
        let startDate = new Date(0); // Default all time
        if (duration === 'day') startDate = new Date(now.setHours(0, 0, 0, 0));
        if (duration === 'week') startDate = new Date(now.setDate(now.getDate() - 7));
        if (duration === 'month') startDate = new Date(now.setMonth(now.getMonth() - 1));

        // 3. Aggregate Orders
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

        // 4. Map back to Shop Names
        const outletPerformance = shops.map(shop => {
            const agg = aggregations.find(a => a.shopId === shop.id);
            return {
                id: shop.id,
                name: shop.name,
                revenue: agg ? (agg._sum.totalAmount || 0) : 0,
                orders: agg ? agg._count.id : 0
            };
        }).sort((a, b) => b.revenue - a.revenue);

        const totalRevenue = outletPerformance.reduce((sum, item) => sum + item.revenue, 0);
        const totalOrders = outletPerformance.reduce((sum, item) => sum + item.orders, 0);

        return {
            totalRevenue,
            totalOrders,
            totalOutlets: shops.length,
            outletPerformance
        };
    }
}
