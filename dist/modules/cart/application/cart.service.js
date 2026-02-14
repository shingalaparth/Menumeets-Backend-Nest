"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const cart_repository_1 = require("../domain/cart.repository");
const menu_service_1 = require("../../menu/application/menu.service");
let CartService = class CartService {
    constructor(repo, menuService) {
        this.repo = repo;
        this.menuService = menuService;
    }
    async getCart(userId) {
        const cart = await this.repo.findByUserId(userId);
        if (!cart)
            return { items: [], subtotal: 0 };
        return this.enrichCart(cart);
    }
    async addItem(userId, body) {
        const { menuItemId, quantity, variantId, addOnIds } = body;
        const menuItem = await this.menuService.getMenuItemById(menuItemId);
        if (!menuItem || !menuItem.isAvailable || menuItem.isArchived) {
            throw new common_1.NotFoundException('Menu item not available');
        }
        const shopId = menuItem.shopId;
        let price = menuItem.price || 0;
        let selectedVariant = null;
        const selectedAddOns = [];
        if (menuItem.variants && Array.isArray(menuItem.variants)) {
            const variants = menuItem.variants;
            if (variants.length > 0) {
                if (!variantId)
                    throw new common_1.BadRequestException('Variant selection required');
                selectedVariant = variants.find((v) => (v._id || v.id || v.name) === variantId || v.name === variantId);
                if (!selectedVariant)
                    throw new common_1.BadRequestException('Invalid variant');
                price = selectedVariant.price;
            }
        }
        if (addOnIds && Array.isArray(addOnIds) && menuItem.addOnGroups) {
            const groups = menuItem.addOnGroups;
            groups.forEach((group) => {
                group.addOns.forEach((addOn) => {
                    if (addOnIds.includes(addOn.id) || addOnIds.includes(addOn.name)) {
                        selectedAddOns.push(addOn);
                        price += addOn.price;
                    }
                });
            });
        }
        let cart = await this.repo.findByUserId(userId);
        if (cart && cart.shopId && cart.shopId !== shopId) {
            if (cart.shopId !== shopId) {
                throw new common_1.BadRequestException('Cart contains items from another shop. Please clear cart first.');
            }
        }
        if (!cart) {
            cart = await this.repo.createCart(userId, shopId, null);
            cart.items = [];
        }
        const activeCart = cart;
        const items = activeCart.items || [];
        const existingItem = items.find((i) => i.menuItemId === menuItemId &&
            JSON.stringify(i.variant) === JSON.stringify(selectedVariant) &&
            JSON.stringify(i.addOns) === JSON.stringify(selectedAddOns));
        if (existingItem) {
            await this.repo.updateItemQuantity(existingItem.id, existingItem.quantity + quantity);
        }
        else {
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
    async removeItem(userId, itemId) {
        const cart = await this.repo.findByUserId(userId);
        if (!cart)
            throw new common_1.NotFoundException('Cart not found');
        const item = cart.items.find((i) => i.id === itemId);
        if (!item)
            throw new common_1.NotFoundException('Item not found in cart');
        await this.repo.removeItem(itemId);
        return this.getCart(userId);
    }
    async clearCart(userId) {
        const cart = await this.repo.findByUserId(userId);
        if (cart) {
            await this.repo.clearCart(cart.id);
        }
        return { message: 'Cart cleared' };
    }
    enrichCart(cart) {
        const items = cart.items.map((i) => ({
            ...i,
            total: i.price * i.quantity
        }));
        const subtotal = items.reduce((sum, i) => sum + i.total, 0);
        return { ...cart, items, subtotal };
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cart_repository_1.CART_REPOSITORY)),
    __metadata("design:paramtypes", [Object, menu_service_1.MenuService])
], CartService);
//# sourceMappingURL=cart.service.js.map