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
            include: {
                owner: true,
                foodCourt: true,
                categories: { include: { menuItems: true } },
                tables: true,
                _count: { select: { orders: true, reviews: true } }
            }
        });
    }
    async updateShop(id, data) {
        return this.prisma.shop.update({ where: { id }, data });
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
        return this.prisma.vendor.findUnique({
            where: { id },
            include: { shops: { select: { id: true, name: true, isActive: true } } }
        });
    }
    async updateVendor(id, data) {
        return this.prisma.vendor.update({ where: { id }, data });
    }
    async deleteVendor(id) {
        await this.prisma.vendor.delete({ where: { id } });
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
    async getAllOrders(skip = 0, take = 50, filters) {
        const where = {};
        if (filters?.status)
            where.orderStatus = filters.status;
        if (filters?.shopId)
            where.shopId = filters.shopId;
        if (filters?.startDate || filters?.endDate) {
            where.createdAt = {};
            if (filters.startDate)
                where.createdAt.gte = new Date(filters.startDate);
            if (filters.endDate)
                where.createdAt.lte = new Date(filters.endDate);
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
    async findOrderById(id) {
        return this.prisma.order.findUnique({
            where: { id },
            include: { items: true, user: true, shop: true, table: true }
        });
    }
    async updateOrderStatus(id, status) {
        return this.prisma.order.update({
            where: { id },
            data: { orderStatus: status }
        });
    }
    async getAllUsers(skip = 0, take = 50) {
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                select: { id: true, name: true, email: true, phone: true, createdAt: true }
            }),
            this.prisma.user.count()
        ]);
        return { users: users, total };
    }
    async findUserById(id) {
        return this.prisma.user.findUnique({
            where: { id },
            include: { orders: { take: 10, orderBy: { createdAt: 'desc' } } }
        });
    }
    async getSystemConfigs() {
        return this.prisma.systemConfig.findMany({
            orderBy: { key: 'asc' }
        });
    }
    async upsertSystemConfig(key, value, description) {
        return this.prisma.systemConfig.upsert({
            where: { key },
            update: { value, description },
            create: { key, value, description }
        });
    }
    async getRevenueReport(startDate, endDate) {
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
    async getTopSellingItems(limit = 10, startDate, endDate) {
        const where = {};
        if (startDate || endDate) {
            where.order = { createdAt: {} };
            if (startDate)
                where.order.createdAt.gte = startDate;
            if (endDate)
                where.order.createdAt.lte = endDate;
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
};
exports.AdminPrismaRepository = AdminPrismaRepository;
exports.AdminPrismaRepository = AdminPrismaRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminPrismaRepository);
//# sourceMappingURL=admin.prisma.repository.js.map