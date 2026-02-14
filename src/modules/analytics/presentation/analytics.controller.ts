import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from '../application/analytics.service';
import { UniversalAuthGuard } from '../../../shared/guards/universal-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';

@Controller('analytics')
@UseGuards(UniversalAuthGuard, RolesGuard)
@Roles('vendor', 'admin', 'manager', 'franchise_owner')
export class AnalyticsController {
    constructor(private analyticsService: AnalyticsService) { }

    @Get(':shopId')
    async getShopAnalytics(
        @Param('shopId') shopId: string,
        @Query('duration') duration: string
    ) {
        return this.analyticsService.getShopAnalytics(shopId, duration);
    }

    @Get(':shopId/peak-hours')
    async getPeakHoursAnalytics(
        @Param('shopId') shopId: string,
        @Query('duration') duration: string
    ) {
        return this.analyticsService.getPeakHoursAnalytics(shopId, duration);
    }

    @Get(':shopId/comparison')
    async getComparisonReport(
        @Param('shopId') shopId: string,
        @Query('duration') duration: string
    ) {
        return this.analyticsService.getComparisonReport(shopId, duration);
    }

    @Get(':shopId/categories')
    async getCategoryPerformance(
        @Param('shopId') shopId: string,
        @Query('duration') duration: string
    ) {
        return this.analyticsService.getCategoryPerformance(shopId, duration);
    }

    @Get(':shopId/payments')
    async getPaymentAnalytics(
        @Param('shopId') shopId: string,
        @Query('duration') duration: string
    ) {
        return this.analyticsService.getPaymentAnalytics(shopId, duration);
    }

    @Get(':shopId/invoices-stats')
    async getInvoiceStats(
        @Param('shopId') shopId: string,
        @Query('duration') duration: string
    ) {
        return this.analyticsService.getInvoiceStats(shopId, duration);
    }

    // ── Aliases ──
    @Get(':shopId/daily')
    async getDailyReport(@Param('shopId') shopId: string) {
        return this.analyticsService.getShopAnalytics(shopId, 'day');
    }

    @Get(':shopId/weekly')
    async getWeeklyReport(@Param('shopId') shopId: string) {
        return this.analyticsService.getShopAnalytics(shopId, 'week');
    }

    @Get(':shopId/monthly')
    async getMonthlyReport(@Param('shopId') shopId: string) {
        return this.analyticsService.getShopAnalytics(shopId, 'month');
    }
}
