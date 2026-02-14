import { Inject, Injectable } from '@nestjs/common';
import { AnalyticsRepository, ANALYTICS_REPOSITORY } from '../domain/analytics.repository';

@Injectable()
export class AnalyticsService {
    constructor(
        @Inject(ANALYTICS_REPOSITORY) private readonly repo: AnalyticsRepository
    ) { }

    private getDateRange(duration: string) {
        const now = new Date();
        const endDate = new Date();
        let startDate = new Date();

        switch (duration) {
            case 'day':
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'week':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case '3month':
                startDate.setMonth(now.getMonth() - 3);
                break;
            case '6month':
                startDate.setMonth(now.getMonth() - 6);
                break;
            default:
                startDate = new Date(0);
        }
        return { startDate, endDate };
    }

    async getShopAnalytics(shopId: string, duration = 'day') {
        const { startDate, endDate } = this.getDateRange(duration);

        const [
            revenue,
            orderCount,
            typeStats,
            topItems,
            topTables,
            repeatCustomers,
            avgRating,
            peakHours,
            allCustomers
        ] = await Promise.all([
            this.repo.getShopRevenue(shopId, startDate, endDate),
            this.repo.getShopOrderCount(shopId, startDate, endDate),
            this.repo.getOnlineOfflineStats(shopId, startDate, endDate),
            this.repo.getTopSellingItems(shopId, startDate, endDate, 5),
            this.repo.getTablePerformance(shopId, startDate, endDate, 5),
            this.repo.getRepeatCustomers(shopId, startDate, endDate),
            this.repo.getAverageRating(shopId),
            this.repo.getPeakHours(shopId, startDate, endDate),
            this.repo.getAllCustomers(shopId, startDate, endDate)
        ]);

        return {
            totalRevenue: revenue,
            totalOrders: orderCount,
            onlineRevenue: typeStats.onlineRev,
            offlineRevenue: typeStats.offlineRev,
            onlineOrdersCount: typeStats.online,
            offlineOrdersCount: typeStats.offline,
            averageRating: Number(avgRating.toFixed(1)),
            mostFavItem: topItems[0] || null,
            leastFavItem: topItems.length > 0 ? topItems[topItems.length - 1] : null,
            topTables,
            repeatCustomers,
            repeatCustomersCount: repeatCustomers.length,
            allCustomers,
            totalCustomers: allCustomers.length,
            peakHours
        };
    }

    async getPeakHoursAnalytics(shopId: string, duration = 'week') {
        const { startDate, endDate } = this.getDateRange(duration);
        const peakHours = await this.repo.getPeakHours(shopId, startDate, endDate);
        return { shopId, duration, peakHours };
    }

    async getPaymentAnalytics(shopId: string, duration = 'month') {
        const { startDate, endDate } = this.getDateRange(duration);
        return this.repo.getPaymentAnalytics(shopId, startDate, endDate);
    }

    async getCategoryPerformance(shopId: string, duration = 'month') {
        const { startDate, endDate } = this.getDateRange(duration);
        return this.repo.getCategoryPerformance(shopId, startDate, endDate);
    }

    async getInvoiceStats(shopId: string, duration = 'month') {
        const { startDate, endDate } = this.getDateRange(duration);
        return this.repo.getInvoiceStats(shopId, startDate, endDate);
    }

    async getComparisonReport(shopId: string, baseDuration = 'month') {
        // Current Period
        const { startDate: start1, endDate: end1 } = this.getDateRange(baseDuration);

        // Previous Period (Same duration, shifted back)
        const durationMs = end1.getTime() - start1.getTime();
        const end2 = new Date(start1.getTime()); // Previous end is current start
        const start2 = new Date(end2.getTime() - durationMs);

        const [current, previous] = await Promise.all([
            this.repo.getShopRevenue(shopId, start1, end1),
            this.repo.getShopRevenue(shopId, start2, end2)
        ]);

        const [ordersCurr, ordersPrev] = await Promise.all([
            this.repo.getShopOrderCount(shopId, start1, end1),
            this.repo.getShopOrderCount(shopId, start2, end2)
        ]);

        return {
            period: baseDuration,
            current: { revenue: current, orders: ordersCurr, start: start1, end: end1 },
            previous: { revenue: previous, orders: ordersPrev, start: start2, end: end2 },
            change: {
                revenue: this.calculatePercentageChange(previous, current),
                orders: this.calculatePercentageChange(ordersPrev, ordersCurr)
            }
        };
    }

    private calculatePercentageChange(oldVal: number, newVal: number) {
        if (oldVal === 0) return newVal > 0 ? 100 : 0;
        return Number((((newVal - oldVal) / oldVal) * 100).toFixed(2));
    }
}
