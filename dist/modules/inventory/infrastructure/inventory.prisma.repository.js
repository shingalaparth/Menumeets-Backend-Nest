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
exports.InventoryPrismaRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../infrastructure/database/prisma.service");
let InventoryPrismaRepository = class InventoryPrismaRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createIngredient(data) {
        return this.prisma.ingredient.create({ data });
    }
    async updateIngredient(id, data) {
        return this.prisma.ingredient.update({ where: { id }, data });
    }
    async findIngredientById(id) {
        return this.prisma.ingredient.findUnique({ where: { id } });
    }
    async findIngredientByName(shopId, name) {
        return this.prisma.ingredient.findUnique({
            where: { shopId_name: { shopId, name } }
        });
    }
    async getShopIngredients(shopId) {
        return this.prisma.ingredient.findMany({
            where: { shopId },
            orderBy: { name: 'asc' }
        });
    }
    async getLowStockIngredients(shopId) {
        return this.prisma.ingredient.findMany({
            where: {
                shopId,
            }
        }).then((items) => items.filter((i) => i.currentStock <= i.lowStockThreshold));
    }
    async saveRecipe(data) {
        const { shopId, menuItemId, variantName, ingredients } = data;
        return this.prisma.recipe.create({ data });
    }
    async updateRecipe(id, data) {
        return this.prisma.recipe.update({ where: { id }, data });
    }
    async findRecipe(shopId, menuItemId, variantName = null) {
        return this.prisma.recipe.findFirst({
            where: {
                shopId,
                menuItemId,
                variantName: variantName || null
            }
        });
    }
    async createStockHistory(data) {
        return this.prisma.stockHistory.create({ data });
    }
    async getStockHistory(shopId, limit = 100) {
        return this.prisma.stockHistory.findMany({
            where: { shopId },
            include: { ingredient: true, performedBy: true },
            orderBy: { createdAt: 'desc' },
            take: limit
        });
    }
    async createSupplier(data) {
        return this.prisma.supplier.create({ data });
    }
    async getSuppliers(shopId) {
        return this.prisma.supplier.findMany({
            where: { shopId },
            orderBy: { name: 'asc' }
        });
    }
    async createPurchaseOrder(data) {
        return this.prisma.purchaseOrder.create({ data });
    }
    async findPurchaseOrderById(id) {
        return this.prisma.purchaseOrder.findUnique({
            where: { id },
            include: { supplier: true }
        });
    }
    async updatePurchaseOrder(id, data) {
        return this.prisma.purchaseOrder.update({ where: { id }, data });
    }
    async getShopPurchaseOrders(shopId) {
        return this.prisma.purchaseOrder.findMany({
            where: { shopId },
            include: { supplier: true },
            orderBy: { createdAt: 'desc' }
        });
    }
};
exports.InventoryPrismaRepository = InventoryPrismaRepository;
exports.InventoryPrismaRepository = InventoryPrismaRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryPrismaRepository);
//# sourceMappingURL=inventory.prisma.repository.js.map