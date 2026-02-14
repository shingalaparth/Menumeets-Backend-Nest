import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { AnalyticsRepository } from '../domain/analytics.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class AnalyticsPrismaRepository implements AnalyticsRepository {
    constructor(private prisma: PrismaService) { }

    async getShopRevenue(shopId: string, startDate: Date, endDate: Date): Promise<number> {
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

    async getShopOrderCount(shopId: string, startDate: Date, endDate: Date): Promise<number> {
        return this.prisma.order.count({
            where: {
                shopId,
                orderStatus: 'Completed',
                createdAt: { gte: startDate, lte: endDate }
            }
        });
    }

    async getOnlineOfflineStats(shopId: string, startDate: Date, endDate: Date) {
        // Simple logic: IsPOS = Offline, else Online
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

        result.forEach((r: any) => {
            if (r.isPOS) {
                offline = r._count;
                offlineRev = r._sum.totalAmount || 0;
            } else {
                online = r._count;
                onlineRev = r._sum.totalAmount || 0;
            }
        });

        return { online, offline, onlineRev, offlineRev };
    }

    async getTopSellingItems(shopId: string, startDate: Date, endDate: Date, limit = 5): Promise<any[]> {
        // Group by MenuItemId in OrderItems
        // Need to filter OrderItems by Orders that are Completed within date range.
        // Prisma groupBy doesn't support deep relation filtering easily in one go for aggregations sometimes.
        // But we can filter by 'order'.

        // Strategy: Fetch raw or use findMany aggregation. Prisma groupBy on OrderItem with where order: { ... }

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

        // Sort and limit in memory
        return topItems
            .map((item: any) => ({
                name: item.name,
                id: item.menuItemId,
                count: item._sum.quantity || 0
            }))
            .sort((a: any, b: any) => b.count - a.count)
            .slice(0, limit);
    }

    async getTablePerformance(shopId: string, startDate: Date, endDate: Date, limit = 5): Promise<any[]> {
        // Only orders with tableId
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

        // Sort and limit in memory
        const sortedStats = stats
            .sort((a: any, b: any) => b._count - a._count)
            .slice(0, limit);

        // Hydrate Table info
        const populated = await Promise.all(sortedStats.map(async (s: any) => {
            if (!s.tableId) return null;
            const table = await this.prisma.table.findUnique({ where: { id: s.tableId } });
            return {
                tableNumber: table?.tableNumber || 'Unknown',
                orderCount: s._count
            };
        }));

        return populated.filter(Boolean);
    }

    async getRepeatCustomers(shopId: string, startDate: Date, endDate: Date): Promise<any[]> {
        // Simplification: Registered Users with > 1 order
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

        // Hydrate
        const results = await Promise.all(repeatUsers.map(async (r: any) => {
            if (!r.userId) return null;
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

    async getPeakHours(shopId: string, startDate: Date, endDate: Date): Promise<any[]> {
        // Prisma doesn't support date extraction in groupBy natively for all DBs easily.
        // We use $queryRaw for this specific time-based grouping often.
        // PostgreSQL: EXTRACT(DOW from created_at), EXTRACT(HOUR from created_at)

        const result = await this.prisma.$queryRaw<any[]>`
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

        const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // standard 0-6 in Postgres DOW

        return result.map((r: any) => ({
            day: DAY_NAMES[Number(r.dayOfWeek)],
            hour: Number(r.hour),
            orderCount: Number(r.orderCount),
            revenue: Number(r.revenue)
        }));
    }

    async getAverageRating(shopId: string): Promise<number> {
        const aggregations = await this.prisma.review.aggregate({
            where: { shopId },
            _avg: { rating: true }
        });
        return aggregations._avg.rating || 0;
    }

    async getAllCustomers(shopId: string, startDate: Date, endDate: Date): Promise<any[]> {
        // Fetch all completed orders with user/customer details
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
                customerDetails: true // JSON
            },
            orderBy: { createdAt: 'desc' }
        });

        const customerMap = new Map<string, any>();

        for (const order of orders) {
            let uniqueId = '';
            let name = 'Guest';
            let phone = 'N/A';
            let email = '';
            let source = 'Walk-in';

            // 1. Determine Identity
            if (order.user) {
                uniqueId = order.user.id;
                name = order.user.name;
                phone = order.user.phone;
                email = order.user.email || '';
                source = 'Online';
            } else if (order.customerDetails) {
                const details = order.customerDetails as any;
                if (details.phone) {
                    uniqueId = details.phone;
                    name = details.name || 'Guest';
                    phone = details.phone;
                    source = 'Walk-in';
                }
            }

            // Skip if no unique ID found for grouping
            if (!uniqueId) continue;

            // 2. Aggregate or Set
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
                    totalSpend: 0 // We didn't select totalAmount above to save bandwidth, assuming list view only needs contact info
                });
            } else {
                const existing = customerMap.get(uniqueId);
                existing.orderCount++;
                // Keep earliest date as "Joined On"
                if (new Date(order.createdAt) < new Date(existing.firstOrderDate)) {
                    existing.firstOrderDate = order.createdAt;
                }
            }
        }

        return Array.from(customerMap.values()).sort((a, b) => new Date(b.firstOrderDate).getTime() - new Date(a.firstOrderDate).getTime());
    }
}
