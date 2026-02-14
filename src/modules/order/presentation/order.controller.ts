import { Controller, Post, Get, Patch, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { OrderService } from '../application/order.service';
import { UserAuthGuard } from '../../../shared/guards/user-auth.guard';
import { VendorAuthGuard } from '../../../shared/guards/vendor-auth.guard';
import { UniversalAuthGuard } from '../../../shared/guards/universal-auth.guard';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';

@Controller('orders')
export class OrderController {
    constructor(private orderService: OrderService) { }

    // ── User Endpoints ──

    @Post()
    @UseGuards(UserAuthGuard)
    async placeOrder(@CurrentUser() user: any, @Body() body: any) {
        return this.orderService.placeOrder(user.id, body);
    }

    @Get()
    @UseGuards(UserAuthGuard)
    async getMyOrders(@CurrentUser() user: any) {
        return this.orderService.getMyOrders(user.id);
    }

    @Get(':id')
    @UseGuards(UniversalAuthGuard)
    async getOrderById(@Param('id') id: string) {
        return this.orderService.getOrderById(id);
    }

    // ── Reorder ──
    @Post('reorder/:orderId')
    @UseGuards(UserAuthGuard)
    async reorderPrevious(@CurrentUser() user: any, @Param('orderId') orderId: string) {
        return this.orderService.reorderPrevious(user.id, orderId);
    }

    // ── Order Notes ──
    @Patch(':id/notes')
    @UseGuards(UniversalAuthGuard)
    async updateOrderNote(@Param('id') id: string, @Body('note') note: string) {
        return this.orderService.updateOrderNote(id, note);
    }

    // ── Vendor Endpoints ──

    @Post('pos')
    @UseGuards(VendorAuthGuard)
    async placePOSOrder(@Req() req: any, @Body() body: any) {
        return this.orderService.placePOSOrder(req.vendor.id, body);
    }

    @Get('shop/:shopId')
    @UseGuards(VendorAuthGuard)
    async getShopOrders(
        @Param('shopId') shopId: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('status') status?: string
    ) {
        const filters = status ? { orderStatus: status } : undefined;
        return this.orderService.getShopOrders(shopId, parseInt(page || '1'), parseInt(limit || '20'), filters);
    }

    @Get('shop/:shopId/active')
    @UseGuards(VendorAuthGuard)
    async getActiveOrders(@Param('shopId') shopId: string) {
        return this.orderService.getActiveOrders(shopId);
    }

    @Patch(':id/status')
    @UseGuards(VendorAuthGuard)
    async updateStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.orderService.updateStatus(id, status);
    }

    @Post(':id/cancel')
    @UseGuards(UniversalAuthGuard)
    async cancelOrder(
        @Param('id') id: string,
        @Req() req: any,
        @Body('reason') reason?: string
    ) {
        const cancelledBy = req.user?.role || 'user';
        return this.orderService.cancelOrder(id, cancelledBy, reason);
    }

    @Patch(':id/modify')
    @UseGuards(VendorAuthGuard)
    async modifyOrder(@Param('id') id: string, @Body() body: any) {
        return this.orderService.modifyOrder(id, body);
    }

    @Post(':id/accept-counter')
    @UseGuards(VendorAuthGuard)
    async acceptPayAtCounter(@Param('id') id: string, @Req() req: any) {
        return this.orderService.acceptPayAtCounterOrder(id, req.vendor.id);
    }

    // ── Analytics ──
    @Get('shop/:shopId/analytics')
    @UseGuards(VendorAuthGuard)
    async getShopAnalytics(@Param('shopId') shopId: string, @Query('duration') duration: string) {
        return this.orderService.getOrderAnalytics(shopId, duration);
    }

    // ── Item Management ──
    @Patch(':id/items/:itemId')
    @UseGuards(VendorAuthGuard)
    async updateOrderItemQuantity(
        @Param('id') orderId: string,
        @Param('itemId') itemId: string,
        @Body('quantity') quantity: number
    ) {
        return this.orderService.updateOrderItemQuantity(orderId, itemId, quantity);
    }

    // ── KOT ──
    @Get('kot/:shopId')
    @UseGuards(VendorAuthGuard)
    async getKOTOrders(@Param('shopId') shopId: string) {
        return this.orderService.getKOTOrders(shopId);
    }
}
