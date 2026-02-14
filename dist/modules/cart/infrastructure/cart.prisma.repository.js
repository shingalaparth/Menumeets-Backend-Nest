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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartPrismaRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../infrastructure/database/prisma.service");
let CartPrismaRepository = class CartPrismaRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByUserId(userId) {
        return this.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        menuItem: true,
                        shop: true
                    },
                    orderBy: { name: 'asc' }
                }
            }
        });
    }
    async createCart(userId, shopId, foodCourtId) {
        return this.prisma.cart.create({
            data: { userId, shopId, foodCourtId }
        });
    }
    async addItem(cartId, itemData) {
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
    async updateItemQuantity(itemId, quantity) {
        return this.prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity }
        });
    }
    async removeItem(itemId) {
        await this.prisma.cartItem.delete({
            where: { id: itemId }
        });
    }
    async clearCart(cartId) {
        await this.prisma.cartItem.deleteMany({
            where: { cartId }
        });
    }
};
exports.CartPrismaRepository = CartPrismaRepository;
exports.CartPrismaRepository = CartPrismaRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartPrismaRepository);
//# sourceMappingURL=cart.prisma.repository.js.map