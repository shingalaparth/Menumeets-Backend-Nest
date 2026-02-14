import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { CART_REPOSITORY, CartRepository } from '../domain/cart.repository';
import { MenuService } from '../../menu/application/menu.service';

@Injectable()
export class CartService {
    constructor(
        @Inject(CART_REPOSITORY) private repo: CartRepository,
        private menuService: MenuService
    ) { }

    async getCart(userId: string) {
        const cart = await this.repo.findByUserId(userId);
        if (!cart) return { items: [], subtotal: 0 };
        return this.enrichCart(cart);
    }

    async addItem(userId: string, body: any) {
        const { menuItemId, quantity, variantId, addOnIds } = body;

        // 1. Fetch Item
        const menuItem = await this.menuService.getMenuItemById(menuItemId);
        if (!menuItem || !menuItem.isAvailable || menuItem.isArchived) {
            throw new NotFoundException('Menu item not available');
        }

        const shopId = menuItem.shopId;

        // 2. Calculate Price
        let price = menuItem.price || 0;
        let selectedVariant: any = null;
        const selectedAddOns: any[] = [];

        // Variants
        if (menuItem.variants && Array.isArray(menuItem.variants as any)) {
            const variants = menuItem.variants as any[];
            if (variants.length > 0) {
                if (!variantId) throw new BadRequestException('Variant selection required');
                // Check ID or Name
                selectedVariant = variants.find((v: any) => (v._id || v.id || v.name) === variantId || v.name === variantId);

                if (!selectedVariant) throw new BadRequestException('Invalid variant');
                price = selectedVariant.price;
            }
        }

        // Add-ons
        if (addOnIds && Array.isArray(addOnIds) && menuItem.addOnGroups) {
            const groups = menuItem.addOnGroups as any[];
            groups.forEach((group: any) => {
                group.addOns.forEach((addOn: any) => {
                    if (addOnIds.includes(addOn.id) || addOnIds.includes(addOn.name)) {
                        selectedAddOns.push(addOn);
                        price += addOn.price;
                    }
                });
            });
        }

        // 3. Get/Create Cart
        let cart = await this.repo.findByUserId(userId);

        if (cart && cart.shopId && cart.shopId !== shopId) {
            if (cart.shopId !== shopId) {
                throw new BadRequestException('Cart contains items from another shop. Please clear cart first.');
            }
        }

        if (!cart) {
            cart = await this.repo.createCart(userId, shopId, null);
            (cart as any).items = [];
        }

        const activeCart = cart!;

        // 4. Add Item (Merge if exists)
        const items = (activeCart as any).items || [];
        const existingItem = items.find((i: any) =>
            i.menuItemId === menuItemId &&
            JSON.stringify(i.variant) === JSON.stringify(selectedVariant) &&
            JSON.stringify(i.addOns) === JSON.stringify(selectedAddOns)
        );

        if (existingItem) {
            await this.repo.updateItemQuantity(existingItem.id, existingItem.quantity + quantity);
        } else {
            await this.repo.addItem(activeCart.id, {
                menuItemId,
                name: menuItem.name,
                price,
                quantity,
                variant: selectedVariant,
                addOns: selectedAddOns,
                shopId
            });
        }

        return this.getCart(userId);
    }

    async removeItem(userId: string, itemId: string) {
        const cart = await this.repo.findByUserId(userId);
        if (!cart) throw new NotFoundException('Cart not found');

        const item = cart.items.find((i: any) => i.id === itemId);
        if (!item) throw new NotFoundException('Item not found in cart');

        await this.repo.removeItem(itemId);
        return this.getCart(userId);
    }

    async clearCart(userId: string) {
        const cart = await this.repo.findByUserId(userId);
        if (cart) {
            await this.repo.clearCart(cart.id);
        }
        return { message: 'Cart cleared' };
    }

    private enrichCart(cart: any) {
        // Calculate subtotal
        const items = cart.items.map((i: any) => ({
            ...i,
            total: i.price * i.quantity
        }));
        const subtotal = items.reduce((sum: number, i: any) => sum + i.total, 0);
        return { ...cart, items, subtotal };
    }
}
