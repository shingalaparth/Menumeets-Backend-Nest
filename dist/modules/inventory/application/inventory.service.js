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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const inventory_repository_1 = require("../domain/inventory.repository");
const prisma_service_1 = require("../../../infrastructure/database/prisma.service");
const notification_service_1 = require("../../notification/application/notification.service");
let InventoryService = class InventoryService {
    constructor(repo, prisma, notificationService) {
        this.repo = repo;
        this.prisma = prisma;
        this.notificationService = notificationService;
    }
    async getInventory(shopId) {
        return this.repo.getLowStockIngredients(shopId);
    }
    async addIngredient(shopId, data) {
        const existing = await this.repo.findIngredientByName(shopId, data.name);
        if (existing)
            throw new common_1.BadRequestException("Ingredient already exists");
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
    async adjustStock(shopId, ingredientId, quantity, type, reason, performedBy, cost) {
        const ingredient = await this.repo.findIngredientById(ingredientId);
        if (!ingredient || ingredient.shopId !== shopId)
            throw new common_1.NotFoundException("Ingredient not found");
        const qty = Number(quantity);
        let quantityChange = 0;
        let newStock = ingredient.currentStock;
        if (type === 'PURCHASE') {
            quantityChange = qty;
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
        }
        else {
            quantityChange = -Math.abs(qty);
        }
        newStock += quantityChange;
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
        if (updated.currentStock <= updated.lowStockThreshold) {
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
    async mapRecipe(shopId, menuItemId, variantName, ingredients) {
        const existing = await this.repo.findRecipe(shopId, menuItemId, variantName);
        if (existing) {
            return this.prisma.recipe.update({
                where: { id: existing.id },
                data: { ingredients: ingredients }
            });
        }
        return this.repo.saveRecipe({
            shopId,
            menuItemId,
            variantName,
            ingredients: ingredients
        });
    }
    async updateIngredient(shopId, ingredientId, updates) {
        const ingredient = await this.repo.findIngredientById(ingredientId);
        if (!ingredient || ingredient.shopId !== shopId)
            throw new common_1.NotFoundException("Ingredient not found");
        return this.repo.updateIngredient(ingredientId, updates);
    }
    async getRecipe(shopId, menuItemId) {
        return this.prisma.recipe.findMany({
            where: { shopId, menuItemId }
        });
    }
    async getStockHistory(shopId) {
        return this.repo.getStockHistory(shopId, 100);
    }
    async addSupplier(shopId, data) {
        return this.repo.createSupplier({
            shopId,
            name: data.name,
            contactName: data.contactName,
            phone: data.phone,
            email: data.email,
            address: data.address
        });
    }
    async getSuppliers(shopId) {
        return this.repo.getSuppliers(shopId);
    }
    async createPurchaseOrder(shopId, data) {
        const poNumber = `PO-${Date.now().toString().slice(-6)}`;
        let totalEstimatedCost = 0;
        const items = [];
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
            items: items,
            totalEstimatedCost,
            notes: data.notes,
            expectedDeliveryDate: data.expectedDeliveryDate ? new Date(data.expectedDeliveryDate) : null
        });
    }
    async getPurchaseOrders(shopId) {
        return this.repo.getShopPurchaseOrders(shopId);
    }
    async updatePOStatus(shopId, poId, status, performedBy) {
        const po = await this.repo.findPurchaseOrderById(poId);
        if (!po || po.shopId !== shopId)
            throw new common_1.NotFoundException("PO not found");
        if (po.status === 'RECEIVED' || po.status === 'CANCELLED') {
            throw new common_1.BadRequestException(`PO is already ${po.status}`);
        }
        const updates = { status };
        if (status === 'SENT')
            updates.sentAt = new Date();
        if (status === 'RECEIVED') {
            updates.receivedAt = new Date();
            updates.receivedById = performedBy;
            const items = po.items;
            for (const item of items) {
                const ingredientId = item.ingredientId;
                const qty = item.quantity;
                const unitCost = item.expectedCost;
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
                    item.receivedQuantity = qty;
                }
            }
            updates.items = items;
        }
        return this.repo.updatePurchaseOrder(poId, updates);
    }
    async deductStockForOrder(orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true }
        });
        if (!order)
            return;
        if (order.inventoryDeducted)
            return;
        for (const item of order.items) {
            const variantName = item.variant?.name || null;
            let recipe = await this.repo.findRecipe(order.shopId, item.menuItemId, variantName);
            if (!recipe && variantName) {
                recipe = await this.repo.findRecipe(order.shopId, item.menuItemId, null);
            }
            if (recipe) {
                const ingredients = recipe.ingredients;
                for (const ing of ingredients) {
                    const totalDeduction = ing.quantity * item.quantity;
                    const ingredientDoc = await this.repo.findIngredientById(ing.ingredientId);
                    if (ingredientDoc) {
                        const newStock = ingredientDoc.currentStock - totalDeduction;
                        await this.repo.updateIngredient(ing.ingredientId, { currentStock: newStock });
                        await this.repo.createStockHistory({
                            shopId: order.shopId,
                            ingredientId: ing.ingredientId,
                            changeType: 'SALE',
                            quantityChange: -totalDeduction,
                            stockAfter: newStock,
                            reason: `Order deduction: ${order.shortOrderId}`,
                            performedById: null
                        });
                    }
                }
            }
        }
        await this.prisma.order.update({
            where: { id: orderId },
            data: { inventoryDeducted: true }
        });
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(inventory_repository_1.INVENTORY_REPOSITORY)),
    __metadata("design:paramtypes", [Object, prisma_service_1.PrismaService,
        notification_service_1.NotificationService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map