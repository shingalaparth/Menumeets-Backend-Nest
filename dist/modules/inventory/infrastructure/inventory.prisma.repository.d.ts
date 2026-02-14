import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { InventoryRepository } from '../domain/inventory.repository';
import { Ingredient, Recipe, StockHistory, Supplier, PurchaseOrder } from '@prisma/client';
export declare class InventoryPrismaRepository implements InventoryRepository {
    private prisma;
    constructor(prisma: PrismaService);
    createIngredient(data: any): Promise<Ingredient>;
    updateIngredient(id: string, data: any): Promise<Ingredient>;
    findIngredientById(id: string): Promise<Ingredient | null>;
    findIngredientByName(shopId: string, name: string): Promise<Ingredient | null>;
    getShopIngredients(shopId: string): Promise<Ingredient[]>;
    getLowStockIngredients(shopId: string): Promise<Ingredient[]>;
    saveRecipe(data: any): Promise<Recipe>;
    updateRecipe(id: string, data: any): Promise<Recipe>;
    findRecipe(shopId: string, menuItemId: string, variantName?: string | null): Promise<Recipe | null>;
    createStockHistory(data: any): Promise<StockHistory>;
    getStockHistory(shopId: string, limit?: number): Promise<StockHistory[]>;
    createSupplier(data: any): Promise<Supplier>;
    getSuppliers(shopId: string): Promise<Supplier[]>;
    createPurchaseOrder(data: any): Promise<PurchaseOrder>;
    findPurchaseOrderById(id: string): Promise<PurchaseOrder | null>;
    updatePurchaseOrder(id: string, data: any): Promise<PurchaseOrder>;
    getShopPurchaseOrders(shopId: string): Promise<PurchaseOrder[]>;
}
