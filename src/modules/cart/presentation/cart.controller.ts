import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CartService } from '../application/cart.service';
import { UserAuthGuard } from '../../../shared/guards/user-auth.guard';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get()
    @UseGuards(UserAuthGuard)
    async getMyCart(@CurrentUser() user: any) {
        return this.cartService.getCart(user.id);
    }

    @Post()
    @UseGuards(UserAuthGuard)
    async addItem(@CurrentUser() user: any, @Body() body: any) {
        return this.cartService.addItem(user.id, body);
    }

    @Delete('/items/:itemId')
    @UseGuards(UserAuthGuard)
    async removeItem(@CurrentUser() user: any, @Param('itemId') itemId: string) {
        return this.cartService.removeItem(user.id, itemId);
    }

    @Delete()
    @UseGuards(UserAuthGuard)
    async clearCart(@CurrentUser() user: any) {
        return this.cartService.clearCart(user.id);
    }
}
