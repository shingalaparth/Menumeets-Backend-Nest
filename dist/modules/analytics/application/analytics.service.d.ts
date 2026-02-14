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
    getPeakHoursAnalytics(shopId: string, duration?: string): Promise<{
        shopId: string;
        duration: string;
        peakHours: any[];
    }>;
    getPaymentAnalytics(shopId: string, duration?: string): Promise<any[]>;
    getCategoryPerformance(shopId: string, duration?: string): Promise<any[]>;
    getInvoiceStats(shopId: string, duration?: string): Promise<any>;
    getComparisonReport(shopId: string, baseDuration?: string): Promise<{
        period: string;
        current: {
            revenue: number;
            orders: number;
            start: Date;
            end: Date;
        };
        previous: {
            revenue: number;
            orders: number;
            start: Date;
            end: Date;
        };
        change: {
            revenue: number;
            orders: number;
        };
    }>;
    private calculatePercentageChange;
}
