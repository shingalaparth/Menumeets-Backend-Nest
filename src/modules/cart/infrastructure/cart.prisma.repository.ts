import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { CartRepository } from '../domain/cart.repository';

@Injectable()
export class CartPrismaRepository implements CartRepository {
    constructor(private prisma: PrismaService) { }

    async findByUserId(userId: string) {
        return this.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        menuItem: true, // Fetch menuItem details (image is a JSON field, not a relation)
                        shop: true // Needed for order splitting logic in FC
                    },
                    orderBy: { name: 'asc' } // Stable ordering
                }
            }
        });
    }

    async createCart(userId: string, shopId: string | null, foodCourtId: string | null) {
        return this.prisma.cart.create({
            data: { userId, shopId, foodCourtId }
        });
    }

    async addItem(cartId: string, itemData: any) {
        return this.prisma.cartItem.create({
            data: {
                cartId,
                menuItemId: itemData.menuItemId,
                name: itemData.name,
                price: itemData.price,
                quantity: itemData.quantity,
                variant: itemData.variant,
                addOns: itemData.addOns,
                shopId: itemData.shopId
            }
        });
    }

    async updateItemQuantity(itemId: string, quantity: number) {
        return this.prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity }
        });
    }

    async removeItem(itemId: string) {
        await this.prisma.cartItem.delete({
            where: { id: itemId }
        });
    }

    async clearCart(cartId: string) {
        await this.prisma.cartItem.deleteMany({
            where: { cartId }
        });
    }
}
