import { AnalyticsService } from '../application/analytics.service';
export declare class AnalyticsController {
    private readonly service;
    constructor(service: AnalyticsService);
    getShopDashboard(shopId: string, duration: string): Promise<{
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
