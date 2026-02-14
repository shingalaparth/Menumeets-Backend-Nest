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
exports.AnalyticsPrismaRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../infrastructure/database/prisma.service");
let AnalyticsPrismaRepository = class AnalyticsPrismaRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getShopRevenue(shopId, startDate, endDate) {
        const result = await this.prisma.order.aggregate({
            where: {
                shopId,
                orderStatus: 'Completed',
                createdAt: { gte: startDate, lte: endDate }
            },
            _sum: { totalAmount: true }
        });
        return result._sum.totalAmount || 0;
    }
    async getShopOrderCount(shopId, startDate, endDate) {
        return this.prisma.order.count({
            where: {
                shopId,
                orderStatus: 'Completed',
                createdAt: { gte: startDate, lte: endDate }
            }
        });
    }
    async getOnlineOfflineStats(shopId, startDate, endDate) {
        const result = await this.prisma.order.groupBy({
            by: ['isPOS'],
            where: {
                shopId,
                orderStatus: 'Completed',
                createdAt: { gte: startDate, lte: endDate }
            },
            _sum: { totalAmount: true },
            _count: true
        });
        let online = 0, offline = 0;
        let onlineRev = 0, offlineRev = 0;
        result.forEach((r) => {
            if (r.isPOS) {
                offline = r._count;
                offlineRev = r._sum.totalAmount || 0;
            }
            else {
                online = r._count;
                onlineRev = r._sum.totalAmount || 0;
            }
        });
        return { online, offline, onlineRev, offlineRev };
    }
    async getTopSellingItems(shopId, startDate, endDate, limit = 5) {
        const topItems = await this.prisma.orderItem.groupBy({
            by: ['menuItemId', 'name'],
            where: {
                order: {
                    shopId,
                    orderStatus: 'Completed',
                    createdAt: { gte: startDate, lte: endDate }
                }
            },
            _sum: { quantity: true }
        });
        return topItems
            .map((item) => ({
            name: item.name,
            id: item.menuItemId,
            count: item._sum.quantity || 0
        }))
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    }
    async getTablePerformance(shopId, startDate, endDate, limit = 5) {
        const stats = await this.prisma.order.groupBy({
            by: ['tableId'],
            where: {
                shopId,
                tableId: { not: null },
                orderStatus: 'Completed',
                createdAt: { gte: startDate, lte: endDate }
            },
            _count: true
        });
        const sortedStats = stats
            .sort((a, b) => b._count - a._count)
            .slice(0, limit);
        const populated = await Promise.all(sortedStats.map(async (s) => {
            if (!s.tableId)
                return null;
            const table = await this.prisma.table.findUnique({ where: { id: s.tableId } });
            return {
                tableNumber: table?.tableNumber || 'Unknown',
                orderCount: s._count
            };
        }));
        return populated.filter(Boolean);
    }
    async getRepeatCustomers(shopId, startDate, endDate) {
        const repeatUsers = await this.prisma.order.groupBy({
            by: ['userId'],
            where: {
                shopId,
                userId: { not: null },
                orderStatus: 'Completed',
                createdAt: { gte: startDate, lte: endDate }
            },
            _count: true,
            _sum: { totalAmount: true },
            having: {
                userId: { _count: { gt: 1 } }
            }
        });
        const results = await Promise.all(repeatUsers.map(async (r) => {
            if (!r.userId)
                return null;
            const user = await this.prisma.user.findUnique({ where: { id: r.userId } });
            return {
                name: user?.name,
                phone: user?.phone,
                orderCount: r._count,
                totalSpend: r._sum.totalAmount
            };
        }));
        return results.filter(Boolean);
    }
    async getPeakHours(shopId, startDate, endDate) {
        const result = await this.prisma.$queryRaw `
            SELECT 
                EXTRACT(DOW FROM "created_at" AT TIME ZONE 'Asia/Kolkata') as "dayOfWeek",
                EXTRACT(HOUR FROM "created_at" AT TIME ZONE 'Asia/Kolkata') as "hour",
                COUNT(*) as "orderCount",
                SUM("total_amount") as "revenue"
            FROM "orders"
            WHERE "shop_id" = ${shopId}
            AND "order_status" = 'Completed'
            AND "created_at" >= ${startDate}
            AND "created_at" <= ${endDate}
            GROUP BY "dayOfWeek", "hour"
            ORDER BY "dayOfWeek", "hour"
        `;
        const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return result.map((r) => ({
            day: DAY_NAMES[Number(r.dayOfWeek)],
            hour: Number(r.hour),
            orderCount: Number(r.orderCount),
            revenue: Number(r.revenue)
        }));
    }
    async getAverageRating(shopId) {
        const aggregations = await this.prisma.review.aggregate({
            where: { shopId },
            _avg: { rating: true }
        });
        return aggregations._avg.rating || 0;
    }
    async getAllCustomers(shopId, startDate, endDate) {
        const orders = await this.prisma.order.findMany({
            where: {
                shopId,
                orderStatus: 'Completed',
                createdAt: { gte: startDate, lte: endDate }
            },
            select: {
                id: true,
                createdAt: true,
                orderType: true,
                isPOS: true,
                userId: true,
                user: { select: { id: true, name: true, phone: true, email: true } },
                customerDetails: true
            },
            orderBy: { createdAt: 'desc' }
        });
        const customerMap = new Map();
        for (const order of orders) {
            let uniqueId = '';
            let name = 'Guest';
            let phone = 'N/A';
            let email = '';
            let source = 'Walk-in';
            if (order.user) {
                uniqueId = order.user.id;
                name = order.user.name;
                phone = order.user.phone;
                email = order.user.email || '';
                source = 'Online';
            }
            else if (order.customerDetails) {
                const details = order.customerDetails;
                if (details.phone) {
                    uniqueId = details.phone;
                    name = details.name || 'Guest';
                    phone = details.phone;
                    source = 'Walk-in';
                }
            }
            if (!uniqueId)
                continue;
            if (!customerMap.has(uniqueId)) {
                customerMap.set(uniqueId, {
                    user: order.userId || null,
                    name,
                    phone,
                    email,
                    source: `${source} • ${order.orderType || 'Dining'}`,
                    firstOrderDate: order.createdAt,
                    latestOrderType: order.orderType,
                    orderCount: 1,
                    totalSpend: 0
                });
            }
            else {
                const existing = customerMap.get(uniqueId);
                existing.orderCount++;
                if (new Date(order.createdAt) < new Date(existing.firstOrderDate)) {
                    existing.firstOrderDate = order.createdAt;
                }
            }
        }
        return Array.from(customerMap.values()).sort((a, b) => new Date(b.firstOrderDate).getTime() - new Date(a.firstOrderDate).getTime());
    }
    async getPaymentAnalytics(shopId, startDate, endDate) {
        const result = await this.prisma.order.groupBy({
            by: ['paymentMethod'],
            where: {
                shopId,
                orderStatus: 'Completed',
                createdAt: { gte: startDate, lte: endDate }
            },
            _sum: { totalAmount: true },
            _count: true
        });
        return result.map(r => ({
            method: r.paymentMethod || 'Unknown',
            count: r._count,
            amount: r._sum.totalAmount || 0
        }));
    }
    async getCategoryPerformance(shopId, startDate, endDate) {
        const itemStats = await this.prisma.orderItem.groupBy({
            by: ['menuItemId'],
            where: {
                order: {
                    shopId,
                    orderStatus: 'Completed',
                    createdAt: { gte: startDate, lte: endDate }
                }
            },
            _sum: { quantity: true, price: true }
        });
        const result = await this.prisma.$queryRaw `
            SELECT 
                c.name as "categoryName",
                COUNT(oi.id) as "itemCount",
                SUM(oi.price * oi.quantity) as "revenue"
            FROM "order_items" oi
            JOIN "menu_items" mi ON oi."menu_item_id" = mi.id
            JOIN "categories" c ON mi."category_id" = c.id
            JOIN "orders" o ON oi."order_id" = o.id
            WHERE o."shop_id" = ${shopId}
            AND o."order_status" = 'Completed'
            AND o."created_at" >= ${startDate}
            AND o."created_at" <= ${endDate}
            GROUP BY c.name
            ORDER BY "revenue" DESC
        `;
        return result.map((r) => ({
            category: r.categoryName,
            count: Number(r.itemCount),
            revenue: Number(r.revenue)
        }));
    }
    async getInvoiceStats(shopId, startDate, endDate) {
        const stats = await this.prisma.invoice.groupBy({
            by: ['status'],
            where: {
                order: {
                    shopId,
                    createdAt: { gte: startDate, lte: endDate }
                }
            },
            _count: true,
            _sum: { grandTotal: true }
        });
        const result = {
            totalInvoices: 0,
            paidAmount: 0,
            pendingAmount: 0,
            cancelledAmount: 0
        };
        stats.forEach(s => {
            result.totalInvoices += s._count;
            if (s.status === 'PAID') {
                result.paidAmount += (s._sum.grandTotal || 0);
            }
            else if (s.status === 'UNPAID' || s.status === 'PENDING') {
                result.pendingAmount += (s._sum.grandTotal || 0);
            }
            else if (s.status === 'CANCELLED') {
                result.cancelledAmount += (s._sum.grandTotal || 0);
            }
        });
        return result;
    }
};
exports.AnalyticsPrismaRepository = AnalyticsPrismaRepository;
exports.AnalyticsPrismaRepository = AnalyticsPrismaRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsPrismaRepository);
//# sourceMappingURL=analytics.prisma.repository.js.map