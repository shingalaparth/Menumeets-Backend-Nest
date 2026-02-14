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
exports.FranchiseService = void 0;
const common_1 = require("@nestjs/common");
const franchise_repository_1 = require("../domain/franchise.repository");
const shop_service_1 = require("../../shop/application/shop.service");
const prisma_service_1 = require("../../../infrastructure/database/prisma.service");
let FranchiseService = class FranchiseService {
    constructor(repo, shopService, prisma) {
        this.repo = repo;
        this.shopService = shopService;
        this.prisma = prisma;
    }
    async createFranchise(ownerId, data) {
        const existing = await this.repo.findByOwnerId(ownerId);
        if (existing)
            throw new common_1.BadRequestException('Owner already has a franchise');
        return this.repo.create({
            ownerId,
            name: data.name,
            logo: data.logo,
            description: data.description,
            settings: data.settings || {},
            contact: data.contact || {}
        });
    }
    async getMyFranchise(ownerId) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise)
            throw new common_1.NotFoundException('Franchise not found');
        return franchise;
    }
    async updateFranchise(ownerId, data) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise)
            throw new common_1.NotFoundException('Franchise not found');
        return this.repo.update(franchise.id, data);
    }
    async addOutlet(ownerId, shopId) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise)
            throw new common_1.NotFoundException('Franchise not found');
        await this.repo.addShop(franchise.id, shopId);
        return { message: 'Outlet added successfully' };
    }
    async removeOutlet(ownerId, shopId) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise)
            throw new common_1.NotFoundException('Franchise not found');
        await this.repo.removeShop(franchise.id, shopId);
        return { message: 'Outlet removed successfully' };
    }
    async getOutlets(ownerId) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise)
            throw new common_1.NotFoundException('Franchise not found');
        return this.repo.getOutlets(franchise.id);
    }
    async addManager(ownerId, managerVendorId, body) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise)
            throw new common_1.NotFoundException('Franchise not found');
        return this.repo.addManager(franchise.id, managerVendorId, body);
    }
    async removeManager(ownerId, managerVendorId) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise)
            throw new common_1.NotFoundException('Franchise not found');
        return this.repo.removeManager(franchise.id, managerVendorId);
    }
    async getManagers(ownerId) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise)
            throw new common_1.NotFoundException('Franchise not found');
        return this.repo.getManagers(franchise.id);
    }
    async getFranchiseAnalytics(ownerId, duration) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise)
            throw new common_1.NotFoundException('Franchise not found');
        return this.repo.getAnalytics(franchise.id, duration);
    }
    async getOutletShopIds(ownerId) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise)
            throw new common_1.NotFoundException('Franchise not found');
        const outlets = await this.repo.getOutlets(franchise.id);
        return outlets.map((o) => o.id);
    }
    getReportDateRange(period) {
        const endDate = new Date();
        let startDate = new Date();
        switch (period) {
            case 'day':
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'week':
                startDate.setDate(endDate.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(endDate.getMonth() - 1);
                break;
            case '3month':
                startDate.setMonth(endDate.getMonth() - 3);
                break;
            case '6month':
                startDate.setMonth(endDate.getMonth() - 6);
                break;
            case 'year':
                startDate.setFullYear(endDate.getFullYear() - 1);
                break;
            default: startDate = new Date(0);
        }
        return { startDate, endDate };
    }
    async getSalesReport(ownerId, period = 'month') {
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
    async getOutletComparison(ownerId, period = 'month') {
        const shopIds = await this.getOutletShopIds(ownerId);
        const { startDate, endDate } = this.getReportDateRange(period);
        const comparison = await Promise.all(shopIds.map(async (shopId) => {
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
        }));
        return { period, comparison };
    }
    async getOrdersReport(ownerId, period = 'month') {
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
    async getInventoryReport(ownerId) {
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
    async getManagerReport(ownerId, period = 'month') {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise)
            throw new common_1.NotFoundException('Franchise not found');
        const managers = await this.repo.getManagers(franchise.id);
        const report = managers.map((manager) => ({
            managerId: manager.id,
            managerName: manager.name,
            assignedShops: manager.assignedShops || [],
            performance: {
                note: 'Detailed performance metrics require role-based order attribution (future enhancement)'
            }
        }));
        return { period, managers: report };
    }
    async getDistributionMatrix(ownerId) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise)
            throw new common_1.NotFoundException('Franchise not found');
        const outlets = await this.repo.getOutlets(franchise.id);
        const matrix = await Promise.all(outlets.map(async (outlet) => {
            const categories = await this.prisma.category.findMany({
                where: { shopId: outlet.id },
                include: { menuItems: { select: { id: true, name: true, isAvailable: true } } }
            });
            return {
                outletId: outlet.id,
                outletName: outlet.name,
                categories
            };
        }));
        return matrix;
    }
    async toggleItemForOutlet(ownerId, outletId, itemId, enabled) {
        await this.getMyFranchise(ownerId);
        await this.prisma.menuItem.update({
            where: { id: itemId },
            data: { isAvailable: enabled }
        });
        return { message: `Item ${enabled ? 'enabled' : 'disabled'} for outlet` };
    }
};
exports.FranchiseService = FranchiseService;
exports.FranchiseService = FranchiseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(franchise_repository_1.FRANCHISE_REPOSITORY)),
    __metadata("design:paramtypes", [Object, shop_service_1.ShopService,
        prisma_service_1.PrismaService])
], FranchiseService);
//# sourceMappingURL=franchise.service.js.map