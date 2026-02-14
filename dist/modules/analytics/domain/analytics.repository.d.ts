export interface AnalyticsRepository {
    getShopRevenue(shopId: string, startDate: Date, endDate: Date): Promise<number>;
    getShopOrderCount(shopId: string, startDate: Date, endDate: Date): Promise<number>;
    getOnlineOfflineStats(shopId: string, startDate: Date, endDate: Date): Promise<{
        online: number;
        offline: number;
        onlineRev: number;
        offlineRev: number;
    }>;
    getTopSellingItems(shopId: string, startDate: Date, endDate: Date, limit?: number): Promise<any[]>;
    getTablePerformance(shopId: string, startDate: Date, endDate: Date, limit?: number): Promise<any[]>;
    getRepeatCustomers(shopId: string, startDate: Date, endDate: Date): Promise<any[]>;
    getPeakHours(shopId: string, startDate: Date, endDate: Date): Promise<any[]>;
    getAverageRating(shopId: string): Promise<number>;
    getAllCustomers(shopId: string, startDate: Date, endDate: Date): Promise<any[]>;
}
export declare const ANALYTICS_REPOSITORY = "ANALYTICS_REPOSITORY";
