import { Cart, CartItem } from '@prisma/client';

export interface CartRepository {
    findByUserId(userId: string): Promise<any | null>;
    createCart(userId: string, shopId: string | null, foodCourtId: string | null): Promise<any>;
    addItem(cartId: string, itemData: any): Promise<any>;
    updateItemQuantity(itemId: string, quantity: number): Promise<any>;
    removeItem(itemId: string): Promise<void>;
    clearCart(cartId: string): Promise<void>;
}

export const CART_REPOSITORY = 'CART_REPOSITORY';
