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
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const analytics_service_1 = require("../application/analytics.service");
const universal_auth_guard_1 = require("../../../shared/guards/universal-auth.guard");
const roles_guard_1 = require("../../../shared/guards/roles.guard");
const roles_decorator_1 = require("../../../shared/decorators/roles.decorator");
let AnalyticsController = class AnalyticsController {
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async getShopAnalytics(shopId, duration) {
        return this.analyticsService.getShopAnalytics(shopId, duration);
    }
    async getPeakHoursAnalytics(shopId, duration) {
        return this.analyticsService.getPeakHoursAnalytics(shopId, duration);
    }
    async getComparisonReport(shopId, duration) {
        return this.analyticsService.getComparisonReport(shopId, duration);
    }
    async getCategoryPerformance(shopId, duration) {
        return this.analyticsService.getCategoryPerformance(shopId, duration);
    }
    async getPaymentAnalytics(shopId, duration) {
        return this.analyticsService.getPaymentAnalytics(shopId, duration);
    }
    async getInvoiceStats(shopId, duration) {
        return this.analyticsService.getInvoiceStats(shopId, duration);
    }
    async getDailyReport(shopId) {
        return this.analyticsService.getShopAnalytics(shopId, 'day');
    }
    async getWeeklyReport(shopId) {
        return this.analyticsService.getShopAnalytics(shopId, 'week');
    }
    async getMonthlyReport(shopId) {
        return this.analyticsService.getShopAnalytics(shopId, 'month');
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)(':shopId'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, common_1.Query)('duration')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getShopAnalytics", null);
__decorate([
    (0, common_1.Get)(':shopId/peak-hours'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, common_1.Query)('duration')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getPeakHoursAnalytics", null);
__decorate([
    (0, common_1.Get)(':shopId/comparison'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, common_1.Query)('duration')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getComparisonReport", null);
__decorate([
    (0, common_1.Get)(':shopId/categories'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, common_1.Query)('duration')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getCategoryPerformance", null);
__decorate([
    (0, common_1.Get)(':shopId/payments'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, common_1.Query)('duration')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getPaymentAnalytics", null);
__decorate([
    (0, common_1.Get)(':shopId/invoices-stats'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, common_1.Query)('duration')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getInvoiceStats", null);
__decorate([
    (0, common_1.Get)(':shopId/daily'),
    __param(0, (0, common_1.Param)('shopId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getDailyReport", null);
__decorate([
    (0, common_1.Get)(':shopId/weekly'),
    __param(0, (0, common_1.Param)('shopId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getWeeklyReport", null);
__decorate([
    (0, common_1.Get)(':shopId/monthly'),
    __param(0, (0, common_1.Param)('shopId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getMonthlyReport", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, common_1.Controller)('analytics'),
    (0, common_1.UseGuards)(universal_auth_guard_1.UniversalAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('vendor', 'admin', 'manager', 'franchise_owner'),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map