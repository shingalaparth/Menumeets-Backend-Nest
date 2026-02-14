import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { InventoryRepository } from '../domain/inventory.repository';
import { Ingredient, Recipe, StockHistory, Supplier, PurchaseOrder } from '@prisma/client';

@Injectable()
export class InventoryPrismaRepository implements InventoryRepository {
    constructor(private prisma: PrismaService) { }

    // Ingredients
    async createIngredient(data: any): Promise<Ingredient> {
        return this.prisma.ingredient.create({ data });
    }

    async updateIngredient(id: string, data: any): Promise<Ingredient> {
        return this.prisma.ingredient.update({ where: { id }, data });
    }

    async findIngredientById(id: string): Promise<Ingredient | null> {
        return this.prisma.ingredient.findUnique({ where: { id } });
    }

    async findIngredientByName(shopId: string, name: string): Promise<Ingredient | null> {
        return this.prisma.ingredient.findUnique({
            where: { shopId_name: { shopId, name } }
        });
    }

    async getShopIngredients(shopId: string): Promise<Ingredient[]> {
        return this.prisma.ingredient.findMany({
            where: { shopId },
            orderBy: { name: 'asc' }
        });
    }

    async getLowStockIngredients(shopId: string): Promise<Ingredient[]> {
        // Prisma doesn't natively support "where field <= field" in basic filter without atomic extensions or raw query
        // But lowStockThreshold is a field. 
        // We can do this in raw query or fetch all and filter (if small).
        // Or if we trust the business logic to update a flag.
        // Let's use finding all and filtering for now for simplicity, or queryRaw.
        // Actually, let's use queryRaw for efficiency.

        return this.prisma.ingredient.findMany({
            where: {
                shopId,
                // AND: [ { currentStock: { lte: this.prisma.ingredient.fields.lowStockThreshold } } ] // This is not valid in standard Prisma
            }
        }).then((items: Ingredient[]) => items.filter((i: Ingredient) => i.currentStock <= i.lowStockThreshold));
    }

    // Recipes
    async saveRecipe(data: any): Promise<Recipe> {
        const { shopId, menuItemId, variantName, ingredients } = data;

        // Upsert logic handled partially by business layer, but Prisma upsert could work if ID is known
        // Here we'll use find-then-update or create approach logic usually, 
        // but let's implement a direct upsert using cache constraints if possible, 
        // or just standard create/update.
        // Prisma upsert requires a unique constraint where clause.
        // We have @@unique([shopId, menuItemId, variantName])

        // Note: variantName can be null, which adds complexity to unique constraints in some DBs, 
        // but Prisma handles unique nulls in Postgres nicely usually.
        // However, standard prisma upsert input for compound unique with nullable fields can be tricky.
        // We will stick to create or update in service for now to keep repo simple,
        // OR use standard upsert with where: { shopId_menuItemId_variantName: ... }

        // Let's assume standard create for now, service handles 'exists' check
        return this.prisma.recipe.create({ data });
    }

    async updateRecipe(id: string, data: any): Promise<Recipe> {
        return this.prisma.recipe.update({ where: { id }, data });
    }

    async findRecipe(shopId: string, menuItemId: string, variantName: string | null = null): Promise<Recipe | null> {
        // Prisma findFirst is used because strict unique constraint lookup requires exact match object
        // And variantName: null vs undefined can be tricky in the 'where' compound object.
        return this.prisma.recipe.findFirst({
            where: {
                shopId,
                menuItemId,
                variantName: variantName || null
            }
        });
    }

    // Stock
    async createStockHistory(data: any): Promise<StockHistory> {
        return this.prisma.stockHistory.create({ data });
    }

    async getStockHistory(shopId: string, limit = 100): Promise<StockHistory[]> {
        return this.prisma.stockHistory.findMany({
            where: { shopId },
            include: { ingredient: true, performedBy: true },
            orderBy: { createdAt: 'desc' },
            take: limit
        });
    }

    // Suppliers
    async createSupplier(data: any): Promise<Supplier> {
        return this.prisma.supplier.create({ data });
    }

    async getSuppliers(shopId: string): Promise<Supplier[]> {
        return this.prisma.supplier.findMany({
            where: { shopId },
            orderBy: { name: 'asc' }
        });
    }

    // Purchase Orders
    async createPurchaseOrder(data: any): Promise<PurchaseOrder> {
        return this.prisma.purchaseOrder.create({ data });
    }

    async findPurchaseOrderById(id: string): Promise<PurchaseOrder | null> {
        return this.prisma.purchaseOrder.findUnique({
            where: { id },
            include: { supplier: true } // often needed
        });
    }

    async updatePurchaseOrder(id: string, data: any): Promise<PurchaseOrder> {
        return this.prisma.purchaseOrder.update({ where: { id }, data });
    }

    async getShopPurchaseOrders(shopId: string): Promise<PurchaseOrder[]> {
        return this.prisma.purchaseOrder.findMany({
            where: { shopId },
            include: { supplier: true },
            orderBy: { createdAt: 'desc' }
        });
    }
}
