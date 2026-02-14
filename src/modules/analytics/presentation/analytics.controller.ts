import { Controller, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from '../application/analytics.service';
import { UniversalAuthGuard } from '../../../shared/guards/universal-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';

@Controller('analytics')
@UseGuards(UniversalAuthGuard, RolesGuard)
export class AnalyticsController {
    constructor(private readonly service: AnalyticsService) { }

    @Get('shop/:shopId')
    @Roles('vendor', 'admin', 'manager')
    async getShopDashboard(
        @Param('shopId') shopId: string,
        @Query('duration') duration: string
    ) {
        return this.service.getShopAnalytics(shopId, duration);
    }
}
