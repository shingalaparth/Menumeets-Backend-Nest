import { AnalyticsRepository } from '../domain/analytics.repository';
export declare class AnalyticsService {
    private readonly repo;
    constructor(repo: AnalyticsRepository);
    private getDateRange;
    getShopAnalytics(shopId: string, duration?: string): Promise<{
        totalRevenue: number;
        totalOrders: number;
        onlineRevenue: number;
        offlineRevenue: number;
        onlineOrdersCount: number;
        offlineOrdersCount: number;
        averageRating: number;
        mostFavItem: any;
        leastFavItem: any;
        topTables: any[];
        repeatCustomers: any[];
        repeatCustomersCount: number;
        allCustomers: any[];
        totalCustomers: number;
        peakHours: any[];
    }>;
}
