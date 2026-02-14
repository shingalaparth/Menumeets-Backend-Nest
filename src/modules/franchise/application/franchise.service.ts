import { Injectable, Inject, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { FRANCHISE_REPOSITORY, FranchiseRepository } from '../domain/franchise.repository';
import { ShopService } from '../../shop/application/shop.service';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class FranchiseService {
    constructor(
        @Inject(FRANCHISE_REPOSITORY) private repo: FranchiseRepository,
        private shopService: ShopService,
        private prisma: PrismaService
    ) { }

    async createFranchise(ownerId: string, data: any) {
        const existing = await this.repo.findByOwnerId(ownerId);
        if (existing) throw new BadRequestException('Owner already has a franchise');

        return this.repo.create({
            ownerId,
            name: data.name,
            logo: data.logo,
            description: data.description,
            settings: data.settings || {},
            contact: data.contact || {}
        });
    }

    async getMyFranchise(ownerId: string) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise) throw new NotFoundException('Franchise not found');
        return franchise;
    }

    async updateFranchise(ownerId: string, data: any) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise) throw new NotFoundException('Franchise not found');
        return this.repo.update(franchise.id, data);
    }

    async addOutlet(ownerId: string, shopId: string) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise) throw new NotFoundException('Franchise not found');
        await this.repo.addShop(franchise.id, shopId);
        return { message: 'Outlet added successfully' };
    }

    async removeOutlet(ownerId: string, shopId: string) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise) throw new NotFoundException('Franchise not found');
        await this.repo.removeShop(franchise.id, shopId);
        return { message: 'Outlet removed successfully' };
    }

    async getOutlets(ownerId: string) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise) throw new NotFoundException('Franchise not found');
        return this.repo.getOutlets(franchise.id);
    }

    // ── Managers ──

    async addManager(ownerId: string, managerVendorId: string, body: any) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise) throw new NotFoundException('Franchise not found');
        return this.repo.addManager(franchise.id, managerVendorId, body);
    }

    async removeManager(ownerId: string, managerVendorId: string) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise) throw new NotFoundException('Franchise not found');
        return this.repo.removeManager(franchise.id, managerVendorId);
    }

    async getManagers(ownerId: string) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise) throw new NotFoundException('Franchise not found');
        return this.repo.getManagers(franchise.id);
    }

    // ── Analytics ──

    async getFranchiseAnalytics(ownerId: string, duration: string) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise) throw new NotFoundException('Franchise not found');
        return this.repo.getAnalytics(franchise.id, duration);
    }

    // ──────────────────────────────────────
    // Reports (Parity with old franchiseReport.controller.js)
    // ──────────────────────────────────────
    private async getOutletShopIds(ownerId: string): Promise<string[]> {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise) throw new NotFoundException('Franchise not found');
        const outlets = await this.repo.getOutlets(franchise.id);
        return outlets.map((o: any) => o.id);
    }

    private getReportDateRange(period: string) {
        const endDate = new Date();
        let startDate = new Date();
        switch (period) {
            case 'day': startDate.setHours(0, 0, 0, 0); break;
            case 'week': startDate.setDate(endDate.getDate() - 7); break;
            case 'month': startDate.setMonth(endDate.getMonth() - 1); break;
            case '3month': startDate.setMonth(endDate.getMonth() - 3); break;
            case '6month': startDate.setMonth(endDate.getMonth() - 6); break;
            case 'year': startDate.setFullYear(endDate.getFullYear() - 1); break;
            default: startDate = new Date(0);
        }
        return { startDate, endDate };
    }

    async getSalesReport(ownerId: string, period = 'month') {
        const shopIds = await this.getOutletShopIds(ownerId);
        const { startDate, endDate } = this.getReportDateRange(period);

        const result = await this.prisma.order.aggregate({
            where: {
                shopId: { in: shopIds },
                orderStatus: 'Completed',
                createdAt: { gte: startDate, lte: endDate }
            },
            _sum: { totalAmount: true },
            _count: true,
            _avg: { totalAmount: true }
        });

        // Revenue by shop
        const byShop = await this.prisma.order.groupBy({
            by: ['shopId'],
            where: {
                shopId: { in: shopIds },
                orderStatus: 'Completed',
                createdAt: { gte: startDate, lte: endDate }
            },
            _sum: { totalAmount: true },
            _count: true
        });

        return {
            period,
            totalRevenue: result._sum.totalAmount || 0,
            totalOrders: result._count,
            averageOrderValue: result._avg.totalAmount || 0,
            revenueByOutlet: byShop
        };
    }

    async getOutletComparison(ownerId: string, period = 'month') {
        const shopIds = await this.getOutletShopIds(ownerId);
        const { startDate, endDate } = this.getReportDateRange(period);

        const comparison = await Promise.all(
            shopIds.map(async (shopId) => {
                const shop = await this.prisma.shop.findUnique({ where: { id: shopId }, select: { name: true } });
                const stats = await this.prisma.order.aggregate({
                    where: {
                        shopId,
                        orderStatus: 'Completed',
                        createdAt: { gte: startDate, lte: endDate }
                    },
                    _sum: { totalAmount: true },
                    _count: true,
                    _avg: { totalAmount: true }
                });
                const avgRating = await this.prisma.review.aggregate({
                    where: { shopId },
                    _avg: { rating: true }
                });

                return {
                    shopId,
                    shopName: shop?.name || 'Unknown',
                    revenue: stats._sum.totalAmount || 0,
                    orders: stats._count,
                    avgOrderValue: stats._avg.totalAmount || 0,
                    avgRating: avgRating._avg.rating || 0
                };
            })
        );

        return { period, comparison };
    }

    async getOrdersReport(ownerId: string, period = 'month') {
        const shopIds = await this.getOutletShopIds(ownerId);
        const { startDate, endDate } = this.getReportDateRange(period);

        const statusBreakdown = await this.prisma.order.groupBy({
            by: ['orderStatus'],
            where: {
                shopId: { in: shopIds },
                createdAt: { gte: startDate, lte: endDate }
            },
            _count: true
        });

        const typeBreakdown = await this.prisma.order.groupBy({
            by: ['orderType'],
            where: {
                shopId: { in: shopIds },
                createdAt: { gte: startDate, lte: endDate }
            },
            _count: true
        });

        return {
            period,
            statusBreakdown,
            typeBreakdown,
            totalOrders: statusBreakdown.reduce((sum, s) => sum + s._count, 0)
        };
    }

    async getInventoryReport(ownerId: string) {
        const shopIds = await this.getOutletShopIds(ownerId);

        const items = await this.prisma.menuItem.findMany({
            where: { shopId: { in: shopIds } },
            select: {
                id: true,
                name: true,
                price: true,
                isAvailable: true,
                shopId: true,
                _count: { select: { orderItems: true } }
            }
        });

        return {
            totalItems: items.length,
            availableItems: items.filter(i => i.isAvailable).length,
            unavailableItems: items.filter(i => !i.isAvailable).length,
            items
        };
    }

    async getManagerReport(ownerId: string, period = 'month') {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise) throw new NotFoundException('Franchise not found');

        const managers = await this.repo.getManagers(franchise.id);

        // For each manager, get the shops they manage and their performance
        const report = managers.map((manager: any) => ({
            managerId: manager.id,
            managerName: manager.name,
            assignedShops: manager.assignedShops || [],
            performance: {
                note: 'Detailed performance metrics require role-based order attribution (future enhancement)'
            }
        }));

        return { period, managers: report };
    }

    // ── Menu Distribution (stubbed, completing in Global Menu module) ──

    async getDistributionMatrix(ownerId: string) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise) throw new NotFoundException('Franchise not found');

        const outlets = await this.repo.getOutlets(franchise.id);

        // For each outlet, get their menu items
        const matrix = await Promise.all(
            outlets.map(async (outlet: any) => {
                const categories = await this.prisma.category.findMany({
                    where: { shopId: outlet.id },
                    include: { menuItems: { select: { id: true, name: true, isAvailable: true } } }
                });
                return {
                    outletId: outlet.id,
                    outletName: outlet.name,
                    categories
                };
            })
        );

        return matrix;
    }

    async toggleItemForOutlet(ownerId: string, outletId: string, itemId: string, enabled: boolean) {
        // Verify ownership
        await this.getMyFranchise(ownerId);

        await this.prisma.menuItem.update({
            where: { id: itemId },
            data: { isAvailable: enabled }
        });

        return { message: `Item ${enabled ? 'enabled' : 'disabled'} for outlet` };
    }
}
