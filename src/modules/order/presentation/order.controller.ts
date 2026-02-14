import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { OrderService } from '../application/order.service';
import { UserAuthGuard } from '../../../shared/guards/user-auth.guard';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';

@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

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
    @UseGuards(UserAuthGuard)
    async getOrderById(@Param('id') id: string) {
        return this.orderService.getOrderById(id);
    }
}
