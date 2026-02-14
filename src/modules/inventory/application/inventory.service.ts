import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { INVENTORY_REPOSITORY, InventoryRepository } from '../domain/inventory.repository';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

import { NotificationService } from '../../notification/application/notification.service';

@Injectable()
export class InventoryService {
    constructor(
        @Inject(INVENTORY_REPOSITORY) private repo: InventoryRepository,
        private prisma: PrismaService,
        private notificationService: NotificationService
    ) { }

    // --- Ingredients ---
    async getInventory(shopId: string) {
        return this.repo.getLowStockIngredients(shopId); // Or a new method getAllIngredients if we want all
    }

    async addIngredient(shopId: string, data: any) {
        // Check if exists
        const existing = await this.repo.findIngredientByName(shopId, data.name);
        if (existing) throw new BadRequestException("Ingredient already exists");

        return this.repo.createIngredient({
            shopId,
            name: data.name,
            unit: data.unit,
            category: data.category,
            currentStock: data.currentStock || 0,
            costPerUnit: data.costPerUnit || 0,
            lowStockThreshold: data.lowStockThreshold || 0,
            supplierName: data.supplierName,
            supplierContact: data.supplierContact
        });
    }

    // --- Stock ---
    async adjustStock(shopId: string, ingredientId: string, quantity: number, type: string, reason: string, performedBy: string, cost?: number) {
        const ingredient = await this.repo.findIngredientById(ingredientId);
        if (!ingredient || ingredient.shopId !== shopId) throw new NotFoundException("Ingredient not found");

        const qty = Number(quantity);
        let quantityChange = 0;
        let newStock = ingredient.currentStock;

        if (type === 'PURCHASE') {
            quantityChange = qty;

            // WAC (Weighted Average Cost)
            if (cost && cost > 0) {
                const currentVal = ingredient.currentStock * ingredient.costPerUnit;
                const addedVal = Number(cost);
                const newTotalStock = ingredient.currentStock + qty;

                if (newTotalStock > 0) {
                    const newCostPerUnit = (currentVal + addedVal) / newTotalStock;
                    await this.repo.updateIngredient(ingredientId, {
                        costPerUnit: newCostPerUnit,
                        lastPurchaseCost: addedVal / qty,
                        lastPurchaseDate: new Date()
                    });
                }
            }
        } else {
            // SALE, WASTAGE, ADJUSTMENT (Reduce)
            quantityChange = -Math.abs(qty);
        }

        newStock += quantityChange;

        // Atomic update ideally, but here sequential
        const updated = await this.repo.updateIngredient(ingredientId, { currentStock: newStock });

        await this.repo.createStockHistory({
            shopId,
            ingredientId,
            changeType: type,
            quantityChange,
            stockAfter: newStock,
            reason,
            performedById: performedBy
        });

        // Check Low Stock
        if (updated.currentStock <= updated.lowStockThreshold) {
            // Notify Shop
            // Need shop owner id. Fetch shop.
            const shop = await this.prisma.shop.findUnique({ where: { id: shopId } });
            if (shop && shop.ownerId) {
                await this.notificationService.sendNotification({
                    vendorId: shop.ownerId,
                    title: 'Low Stock Alert',
                    body: `Ingredient ${updated.name} is running low (${updated.currentStock} ${updated.unit}).`,
                    type: 'INVENTORY_LOW',
                    metadata: { ingredientId: updated.id, shopId }
                });
            }
        }

        return updated;
    }

    // --- Recipes ---
    async mapRecipe(shopId: string, menuItemId: string, variantName: string | null, ingredients: { ingredientId: string, quantity: number }[]) {
        // Logic to check if recipe exists
        // Since we didn't implement robust find in repo for compound key, 
        // let's try to find first. 
        // Actually repo.findRecipe IS implemented.
        const existing = await this.repo.findRecipe(shopId, menuItemId, variantName);

        if (existing) {
            // Update logic... specialized update method not in repo interface, 
            // but we can use prisma direct or add to repo. 
            // For now, let's just delete and recreate or standard update.
            // Updating a purely JSON field is easy with prisma update.
            return this.prisma.recipe.update({
                where: { id: existing.id },
                data: { ingredients: ingredients as any }
            });
        }

        return this.repo.saveRecipe({
            shopId,
            menuItemId,
            variantName,
            ingredients: ingredients as any
        });
    }

    // --- Update Ingredient ---
    async updateIngredient(shopId: string, ingredientId: string, updates: any) {
        const ingredient = await this.repo.findIngredientById(ingredientId);
        if (!ingredient || ingredient.shopId !== shopId) throw new NotFoundException("Ingredient not found");

        return this.repo.updateIngredient(ingredientId, updates);
    }

    // --- Recipes ---
    async getRecipe(shopId: string, menuItemId: string) {
        // Legacy: fetches recipes for a menuItem (could be multiple if we supported variants in find, 
        // but repo currently finds ONE by composite key. 
        // The legacy controller uses Recipe.find({ shop, menuItem }) to return ARRAY.
        // Our repo currently has findRecipe which returns ONE.
        // We need a method to get ALL recipes for a menu item.
        // Let's add getRecipesForMenuItem to repo or use prisma directly here if needed, 
        // but better to add to repo for clean DDD. 
        // For now, let's use Prisma directly to save time on repo interface churn if acceptable, 
        // OR better, allow finding all recipes.
        // Legacy returns array, parity preserved.
        return this.prisma.recipe.findMany({
            where: { shopId, menuItemId }
        });
    }

    // --- Stock History ---
    async getStockHistory(shopId: string) {
        return this.repo.getStockHistory(shopId, 100);
    }

    // --- Suppliers ---
    async addSupplier(shopId: string, data: any) {
        return this.repo.createSupplier({
            shopId,
            name: data.name,
            contactName: data.contactName,
            phone: data.phone,
            email: data.email,
            address: data.address
        });
    }

    async getSuppliers(shopId: string) {
        return this.repo.getSuppliers(shopId);
    }

    // --- Purchase Orders ---
    async createPurchaseOrder(shopId: string, data: any) {
        const poNumber = `PO-${Date.now().toString().slice(-6)}`;
        let totalEstimatedCost = 0;
        const items = [];

        // Validate items and calc cost
        for (const item of data.items) {
            const ing = await this.repo.findIngredientById(item.ingredientId);
            if (ing) {
                const cost = item.expectedCost || ing.costPerUnit;
                items.push({
                    ingredientId: ing.id,
                    name: ing.name,
                    unit: ing.unit,
                    quantity: item.quantity,
                    expectedCost: cost,
                    receivedQuantity: 0
                });
                totalEstimatedCost += (item.quantity * cost);
            }
        }

        return this.repo.createPurchaseOrder({
            shopId,
            supplierId: data.supplierId,
            poNumber,
            status: 'DRAFT',
            items: items as any, // JSON
            totalEstimatedCost,
            notes: data.notes,
            expectedDeliveryDate: data.expectedDeliveryDate ? new Date(data.expectedDeliveryDate) : null
        });
    }

    async getPurchaseOrders(shopId: string) {
        return this.repo.getShopPurchaseOrders(shopId);
    }

    async updatePOStatus(shopId: string, poId: string, status: string, performedBy: string) {
        const po = await this.repo.findPurchaseOrderById(poId);
        if (!po || po.shopId !== shopId) throw new NotFoundException("PO not found");

        if (po.status === 'RECEIVED' || po.status === 'CANCELLED') {
            throw new BadRequestException(`PO is already ${po.status}`);
        }

        const updates: any = { status };
        if (status === 'SENT') updates.sentAt = new Date();

        if (status === 'RECEIVED') {
            updates.receivedAt = new Date();
            updates.receivedById = performedBy;

            // Process Stock Updates from PO Items
            const items = po.items as any[]; // JSON
            for (const item of items) {
                const ingredientId = item.ingredientId;
                const qty = item.quantity;
                const unitCost = item.expectedCost;

                // Adjust Stock (Logic similar to adjustStock but streamlined)
                const ing = await this.repo.findIngredientById(ingredientId);
                if (ing) {
                    const oldStock = ing.currentStock;
                    const oldCost = ing.costPerUnit;
                    const newTotalVal = (oldStock * oldCost) + (qty * unitCost);
                    const newTotalQty = oldStock + qty;

                    const newCostPerUnit = newTotalQty > 0 ? (newTotalVal / newTotalQty) : unitCost;

                    await this.repo.updateIngredient(ingredientId, {
                        currentStock: newTotalQty,
                        costPerUnit: newCostPerUnit,
                        lastPurchaseCost: unitCost,
                        lastPurchaseDate: new Date()
                    });

                    await this.repo.createStockHistory({
                        shopId,
                        ingredientId,
                        changeType: 'PURCHASE',
                        quantityChange: qty,
                        stockAfter: newTotalQty,
                        reason: `PO Received: ${po.poNumber}`,
                        performedById: performedBy
                    });

                    // Update received quantity in PO item (in memory for now, strictly we should update JSON)
                    item.receivedQuantity = qty;
                }
            }
            updates.items = items; // Save updated items with receivedQuantity
        }

        return this.repo.updatePurchaseOrder(poId, updates);
    }

    // --- Automatic Deduction (Existing) ---
    async deductStockForOrder(orderId: string) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true } // items is OrderItem[]
        });

        if (!order) return;
        if (order.inventoryDeducted) return; // Prevention

        for (const item of order.items) {
            const variantName = (item.variant as any)?.name || null;

            // Find Recipe
            let recipe = await this.repo.findRecipe(order.shopId!, item.menuItemId, variantName);

            // Fallback to base recipe if variant specific not found
            if (!recipe && variantName) {
                recipe = await this.repo.findRecipe(order.shopId!, item.menuItemId, null);
            }

            if (recipe) {
                const ingredients = recipe.ingredients as { ingredientId: string, quantity: number }[];
                for (const ing of ingredients) {
                    const totalDeduction = ing.quantity * item.quantity;

                    // Deduct
                    const ingredientDoc = await this.repo.findIngredientById(ing.ingredientId);
                    if (ingredientDoc) {
                        const newStock = ingredientDoc.currentStock - totalDeduction;
                        await this.repo.updateIngredient(ing.ingredientId, { currentStock: newStock });

                        await this.repo.createStockHistory({
                            shopId: order.shopId!,
                            ingredientId: ing.ingredientId,
                            changeType: 'SALE',
                            quantityChange: -totalDeduction,
                            stockAfter: newStock,
                            reason: `Order deduction: ${order.shortOrderId}`,
                            performedById: null // System
                        });
                    }
                }
            }
        }

        // Mark order as processed
        await this.prisma.order.update({
            where: { id: orderId },
            data: { inventoryDeducted: true }
        });
    }
}
