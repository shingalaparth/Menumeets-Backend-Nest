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
exports.FoodCourtPrismaRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../infrastructure/database/prisma.service");
let FoodCourtPrismaRepository = class FoodCourtPrismaRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.foodCourt.create({ data });
    }
    async findById(id) {
        return this.prisma.foodCourt.findUnique({
            where: { id },
            include: { shops: true, manager: true }
        });
    }
    async update(id, data) {
        return this.prisma.foodCourt.update({
            where: { id },
            data,
            include: { shops: true }
        });
    }
    async addShop(foodCourtId, shopId) {
        await this.prisma.shop.update({
            where: { id: shopId },
            data: { foodCourtId }
        });
    }
    async removeShop(foodCourtId, shopId) {
        await this.prisma.shop.update({
            where: { id: shopId },
            data: { foodCourtId: null }
        });
    }
    async getAnalytics(foodCourtId, duration) {
        const shops = await this.prisma.shop.findMany({
            where: { foodCourtId },
            select: { id: true, name: true }
        });
        const shopIds = shops.map(s => s.id);
        if (shopIds.length === 0)
            return { totalRevenue: 0, totalOrders: 0, shopsPerformance: [] };
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
    async getShops(foodCourtId) {
        const fc = await this.prisma.foodCourt.findUnique({
            where: { id: foodCourtId },
            include: { shops: true }
        });
        return fc ? fc.shops : [];
    }
    async findAll() {
        return this.prisma.foodCourt.findMany({
            include: { shops: true, manager: true }
        });
    }
};
exports.FoodCourtPrismaRepository = FoodCourtPrismaRepository;
exports.FoodCourtPrismaRepository = FoodCourtPrismaRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FoodCourtPrismaRepository);
//# sourceMappingURL=food-court.prisma.repository.js.map