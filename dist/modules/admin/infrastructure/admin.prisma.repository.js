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
exports.AdminPrismaRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../infrastructure/database/prisma.service");
let AdminPrismaRepository = class AdminPrismaRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getGlobalStats() {
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
    async getAllShops(skip = 0, take = 50) {
        return this.prisma.shop.findMany({
            skip,
            take,
            include: { owner: { select: { name: true, email: true, phone: true } }, foodCourt: { select: { name: true } } },
            orderBy: { createdAt: 'desc' }
        });
    }
    async findShopById(id) {
        return this.prisma.shop.findUnique({
            where: { id },
            include: { owner: true, foodCourt: true }
        });
    }
    async updateShop(id, data) {
        return this.prisma.shop.update({
            where: { id },
            data
        });
    }
    async deleteShop(id) {
        await this.prisma.shop.delete({ where: { id } });
    }
    async countShops() {
        return this.prisma.shop.count();
    }
    async getAllVendors(skip = 0, take = 50) {
        return this.prisma.vendor.findMany({
            skip,
            take,
            where: { role: { in: ['vendor', 'manager'] } },
            orderBy: { createdAt: 'desc' }
        });
    }
    async findVendorById(id) {
        return this.prisma.vendor.findUnique({ where: { id } });
    }
    async updateVendor(id, data) {
        return this.prisma.vendor.update({
            where: { id },
            data
        });
    }
    async countVendors() {
        return this.prisma.vendor.count({ where: { role: { in: ['vendor', 'manager'] } } });
    }
    async createBroadcast(data) {
        return this.prisma.adminBroadcast.create({ data });
    }
    async getBroadcasts(limit = 20) {
        return this.prisma.adminBroadcast.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: { recipient: { select: { name: true } } }
        });
    }
    async getAllFoodCourts() {
        return this.prisma.foodCourt.findMany({
            include: { manager: { select: { name: true, email: true } }, shops: { select: { id: true } } }
        });
    }
};
exports.AdminPrismaRepository = AdminPrismaRepository;
exports.AdminPrismaRepository = AdminPrismaRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminPrismaRepository);
//# sourceMappingURL=admin.prisma.repository.js.map