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
}
