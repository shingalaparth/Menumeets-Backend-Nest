import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { FoodCourtService } from '../application/food-court.service';
import { VendorAuthGuard } from '../../../shared/guards/vendor-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { CurrentVendor } from '../../../shared/decorators/current-user.decorator';

@Controller('food-courts')
@UseGuards(VendorAuthGuard, RolesGuard)
export class FoodCourtController {
    constructor(private readonly service: FoodCourtService) { }

    @Post()
    @Roles('admin', 'manager') // Manager of the platform or specific FC role
    async createFoodCourt(@Request() req: any, @Body() body: any) {
        return this.service.createFoodCourt(req.vendor.sub || req.vendor.id, body);
    }

    @Get()
    @Roles('admin', 'manager', 'vendor')
    async getAllFoodCourts() {
        return this.service.getAllFoodCourts();
    }

    @Get(':id')
    @Roles('admin', 'manager', 'vendor')
    async getFoodCourt(@Param('id') id: string) {
        return this.service.getFoodCourt(id);
    }

    @Put(':id')
    @Roles('admin', 'manager')
    async updateFoodCourt(@Param('id') id: string, @Body() body: any) {
        return this.service.updateFoodCourt(id, body);
    }

    @Get(':id/shops')
    @Roles('admin', 'manager', 'vendor')
    async getShops(@Param('id') id: string) {
        return this.service.getShops(id);
    }

    @Post(':id/shops')
    @Roles('admin', 'manager')
    async addShop(@Param('id') id: string, @Body() body: { shopId: string }) {
        return this.service.addShop(id, body.shopId);
    }

    @Delete(':id/shops/:shopId')
    @Roles('admin', 'manager')
    async removeShop(@Param('id') id: string, @Param('shopId') shopId: string) {
        return this.service.removeShop(id, shopId);
    }

    // ── Join Requests ──

    @Post(':foodCourtId/join-requests/:shopId')
    @Roles('vendor', 'admin', 'food_court_manager') // Who initiates? Usually Shop. But here route implies FC ID known.
    async requestToJoin(
        @Param('foodCourtId') foodCourtId: string,
        @Param('shopId') shopId: string,
        @CurrentVendor() vendor: any
    ) {
        // Validation: Verify vendor owns shop?
        return this.service.requestToJoin(shopId, foodCourtId);
    }

    @Get(':foodCourtId/join-requests')
    @Roles('vendor', 'admin', 'food_court_manager')
    async getJoinRequests(
        @Param('foodCourtId') foodCourtId: string,
        @CurrentVendor() vendor: any
    ) {
        return this.service.getJoinRequests(foodCourtId);
    }

    @Put(':foodCourtId/join-requests/:requestId')
    @Roles('vendor', 'admin', 'food_court_manager')
    async resolveJoinRequest(
        @Param('foodCourtId') foodCourtId: string,
        @Param('requestId') requestId: string,
        @Body() body: { accept: boolean },
        @CurrentVendor() vendor: any
    ) {
        return this.service.resolveJoinRequest(foodCourtId, requestId, body.accept);
    }

    // ── Analytics ──

    @Get(':foodCourtId/analytics')
    @Roles('vendor', 'admin', 'food_court_manager')
    async getAnalytics(
        @Param('foodCourtId') foodCourtId: string,
        @Query('duration') duration: string = 'week',
        @CurrentVendor() vendor: any
    ) {
        return this.service.getAnalytics(foodCourtId, duration);
    }
}
