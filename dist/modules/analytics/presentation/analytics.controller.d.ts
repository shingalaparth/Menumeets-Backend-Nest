import { AnalyticsService } from '../application/analytics.service';
export declare class AnalyticsController {
    private analyticsService;
    constructor(analyticsService: AnalyticsService);
    getShopAnalytics(shopId: string, duration: string): Promise<{
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
    getPeakHoursAnalytics(shopId: string, duration: string): Promise<{
        shopId: string;
        duration: string;
        peakHours: any[];
    }>;
    getComparisonReport(shopId: string, duration: string): Promise<{
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
    getCategoryPerformance(shopId: string, duration: string): Promise<any[]>;
    getPaymentAnalytics(shopId: string, duration: string): Promise<any[]>;
    getInvoiceStats(shopId: string, duration: string): Promise<any>;
    getDailyReport(shopId: string): Promise<{
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
    getWeeklyReport(shopId: string): Promise<{
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
    getMonthlyReport(shopId: string): Promise<{
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
