import { Controller, Post, Get, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ReviewService } from '../application/review.service';
import { UniversalAuthGuard } from '../../../shared/guards/universal-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';

@Controller('reviews')
export class ReviewController {
    constructor(private readonly service: ReviewService) { }

    @Post()
    @UseGuards(UniversalAuthGuard, RolesGuard)
    @Roles('customer')
    async createReview(@Request() req: any, @Body() body: any) {
        return this.service.createReview(req.user.id, body);
    }

    @Get('shop/:shopId')
    async getShopReviews(@Param('shopId') shopId: string, @Query('page') page: number) {
        return this.service.getReviewsForShop(shopId, Number(page) || 1);
    }

    @Patch(':id/reply')
    @UseGuards(UniversalAuthGuard, RolesGuard)
    @Roles('vendor', 'admin', 'franchise_owner')
    async replyToReview(
        @Request() req: any,
        @Param('id') id: string,
        @Body('reply') reply: string
    ) {
        return this.service.replyToReview(req.vendor?.id || req.user?.id, id, reply);
    }

    @Get('vendor')
    @UseGuards(UniversalAuthGuard, RolesGuard)
    @Roles('vendor', 'admin', 'franchise_owner')
    async getVendorReviews(@Request() req: any, @Query('page') page: number) {
        return this.service.getReviewsForVendor(req.vendor.id, Number(page) || 1);
    }
}
