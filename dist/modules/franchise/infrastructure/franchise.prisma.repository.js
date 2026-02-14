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
exports.FranchisePrismaRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../infrastructure/database/prisma.service");
let FranchisePrismaRepository = class FranchisePrismaRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.franchise.create({ data });
    }
    async findById(id) {
        return this.prisma.franchise.findUnique({
            where: { id },
            include: { shops: true, owner: true }
        });
    }
    async findByOwnerId(ownerId) {
        return this.prisma.franchise.findUnique({
            where: { ownerId },
            include: { shops: true }
        });
    }
    async update(id, data) {
        return this.prisma.franchise.update({
            where: { id },
            data,
            include: { shops: true }
        });
    }
    async addShop(franchiseId, shopId) {
        await this.prisma.shop.update({
            where: { id: shopId },
            data: { franchiseId }
        });
    }
    async removeShop(franchiseId, shopId) {
        await this.prisma.shop.update({
            where: { id: shopId },
            data: { franchiseId: null }
        });
    }
    async getOutlets(franchiseId) {
        const franchise = await this.prisma.franchise.findUnique({
            where: { id: franchiseId },
            include: { shops: true }
        });
        return franchise ? franchise.shops : [];
    }
    async addManager(franchiseId, vendorId, body) {
        const vendor = await this.prisma.vendor.findUnique({ where: { id: vendorId } });
        if (!vendor)
            throw new Error('Vendor not found');
        const role = {
            franchise: franchiseId,
            role: 'franchise_manager',
            regions: body.regions || [],
            assignedShops: body.assignedShops || [],
            permissions: body.permissions || {}
        };
        const currentRoles = vendor.franchiseRoles || [];
        const exists = currentRoles.find((r) => r.franchise === franchiseId);
        if (exists)
            throw new Error('Vendor is already a manager for this franchise');
        return this.prisma.vendor.update({
            where: { id: vendorId },
            data: {
                franchiseRoles: [...currentRoles, role]
            }
        });
    }
    async removeManager(franchiseId, vendorId) {
        const vendor = await this.prisma.vendor.findUnique({ where: { id: vendorId } });
        if (!vendor)
            throw new Error('Vendor not found');
        const currentRoles = vendor.franchiseRoles || [];
        const newRoles = currentRoles.filter((r) => r.franchise !== franchiseId);
        return this.prisma.vendor.update({
            where: { id: vendorId },
            data: { franchiseRoles: newRoles }
        });
    }
    async getManagers(franchiseId) {
        const vendors = await this.prisma.$queryRaw `
            SELECT id, name, email, "number", "franchise_roles"
            FROM "vendors"
            WHERE "franchise_roles"::jsonb @> ${JSON.stringify([{ franchise: franchiseId }])}::jsonb
        `;
        return vendors;
    }
    async getAnalytics(franchiseId, duration) {
        const shops = await this.prisma.shop.findMany({
            where: { franchiseId },
            select: { id: true, name: true }
        });
        const shopIds = shops.map(s => s.id);
        if (shopIds.length === 0)
            return { totalRevenue: 0, totalOrders: 0, outletPerformance: [] };
        const now = new Date();
        let startDate = new Date(0);
        if (duration === 'day')
            startDate = new Date(now.setHours(0, 0, 0, 0));
        if (duration === 'week')
            startDate = new Date(now.setDate(now.getDate() - 7));
        if (duration === 'month')
            startDate = new Date(now.setMonth(now.getMonth() - 1));
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
};
exports.FranchisePrismaRepository = FranchisePrismaRepository;
exports.FranchisePrismaRepository = FranchisePrismaRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FranchisePrismaRepository);
//# sourceMappingURL=franchise.prisma.repository.js.map