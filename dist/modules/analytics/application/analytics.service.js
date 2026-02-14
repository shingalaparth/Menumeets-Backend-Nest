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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const analytics_repository_1 = require("../domain/analytics.repository");
let AnalyticsService = class AnalyticsService {
    constructor(repo) {
        this.repo = repo;
    }
    getDateRange(duration) {
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
    async getShopAnalytics(shopId, duration = 'day') {
        const { startDate, endDate } = this.getDateRange(duration);
        const [revenue, orderCount, typeStats, topItems, topTables, repeatCustomers, avgRating, peakHours, allCustomers] = await Promise.all([
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
    async getPeakHoursAnalytics(shopId, duration = 'week') {
        const { startDate, endDate } = this.getDateRange(duration);
        const peakHours = await this.repo.getPeakHours(shopId, startDate, endDate);
        return { shopId, duration, peakHours };
    }
    async getPaymentAnalytics(shopId, duration = 'month') {
        const { startDate, endDate } = this.getDateRange(duration);
        return this.repo.getPaymentAnalytics(shopId, startDate, endDate);
    }
    async getCategoryPerformance(shopId, duration = 'month') {
        const { startDate, endDate } = this.getDateRange(duration);
        return this.repo.getCategoryPerformance(shopId, startDate, endDate);
    }
    async getInvoiceStats(shopId, duration = 'month') {
        const { startDate, endDate } = this.getDateRange(duration);
        return this.repo.getInvoiceStats(shopId, startDate, endDate);
    }
    async getComparisonReport(shopId, baseDuration = 'month') {
        const { startDate: start1, endDate: end1 } = this.getDateRange(baseDuration);
        const durationMs = end1.getTime() - start1.getTime();
        const end2 = new Date(start1.getTime());
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
    calculatePercentageChange(oldVal, newVal) {
        if (oldVal === 0)
            return newVal > 0 ? 100 : 0;
        return Number((((newVal - oldVal) / oldVal) * 100).toFixed(2));
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(analytics_repository_1.ANALYTICS_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map