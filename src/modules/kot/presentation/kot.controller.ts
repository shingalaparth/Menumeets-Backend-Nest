import { Controller, Post, Get, Put, Body, Param, UseGuards, Req } from '@nestjs/common';
import { KOTService } from '../application/kot.service';
import { KotAuthGuard } from '../../../shared/guards/kot-auth.guard';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';

@Controller('kot')
export class KOTController {
    constructor(private readonly kotService: KOTService) { }

    @Post('login')
    async login(@Body() body: any) {
        return this.kotService.login(body.shopId, body.pin);
    }

    @Get('orders')
    @UseGuards(KotAuthGuard)
    async getKOTOrders(@CurrentUser() shop: any) {
        return this.kotService.getOrders(shop.id);
    }

    @Put('orders/:orderId/status')
    @UseGuards(KotAuthGuard)
    async updateOrderStatus(@CurrentUser() shop: any, @Param('orderId') orderId: string, @Body() body: any) {
        return this.kotService.updateOrderStatus(shop.id, orderId, body.status);
    }
}
