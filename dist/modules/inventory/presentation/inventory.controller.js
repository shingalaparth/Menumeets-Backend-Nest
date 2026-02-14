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
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const inventory_service_1 = require("../application/inventory.service");
const universal_auth_guard_1 = require("../../../shared/guards/universal-auth.guard");
const roles_guard_1 = require("../../../shared/guards/roles.guard");
const roles_decorator_1 = require("../../../shared/decorators/roles.decorator");
let InventoryController = class InventoryController {
    constructor(service) {
        this.service = service;
    }
    async getInventory(shopId) {
        return this.service.getInventory(shopId);
    }
    async addIngredient(shopId, body) {
        return this.service.addIngredient(shopId, body);
    }
    async adjustStock(shopId, req, body) {
        return this.service.adjustStock(shopId, body.ingredientId, body.quantity, body.changeType, body.reason, req.vendor.id, body.cost);
    }
    async mapRecipe(shopId, body) {
        return this.service.mapRecipe(shopId, body.menuItemId, body.variantName, body.ingredients);
    }
    async updateIngredient(shopId, ingredientId, body) {
        return this.service.updateIngredient(shopId, ingredientId, body);
    }
    async getRecipe(shopId, menuItemId) {
        return this.service.getRecipe(shopId, menuItemId);
    }
    async getHistory(shopId) {
        return this.service.getStockHistory(shopId);
    }
    async getSuppliers(shopId) {
        return this.service.getSuppliers(shopId);
    }
    async addSupplier(shopId, body) {
        return this.service.addSupplier(shopId, body);
    }
    async getPurchaseOrders(shopId) {
        return this.service.getPurchaseOrders(shopId);
    }
    async createPurchaseOrder(shopId, body) {
        return this.service.createPurchaseOrder(shopId, body);
    }
    async updatePOStatus(shopId, poId, req, body) {
        return this.service.updatePOStatus(shopId, poId, body.status, req.vendor.id);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Get)('ingredients/:shopId'),
    (0, roles_decorator_1.Roles)('vendor', 'admin', 'franchise_owner'),
    __param(0, (0, common_1.Param)('shopId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getInventory", null);
__decorate([
    (0, common_1.Post)('ingredients/:shopId'),
    (0, roles_decorator_1.Roles)('vendor'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "addIngredient", null);
__decorate([
    (0, common_1.Post)('stock/adjust/:shopId'),
    (0, roles_decorator_1.Roles)('vendor'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "adjustStock", null);
__decorate([
    (0, common_1.Post)('recipes/:shopId'),
    (0, roles_decorator_1.Roles)('vendor'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "mapRecipe", null);
__decorate([
    (0, common_1.Post)('ingredients/:shopId/:ingredientId'),
    (0, roles_decorator_1.Roles)('vendor'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, common_1.Param)('ingredientId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "updateIngredient", null);
__decorate([
    (0, common_1.Get)('recipe/:shopId/:menuItemId'),
    (0, roles_decorator_1.Roles)('vendor', 'admin'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, common_1.Param)('menuItemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getRecipe", null);
__decorate([
    (0, common_1.Get)('history/:shopId'),
    (0, roles_decorator_1.Roles)('vendor', 'admin'),
    __param(0, (0, common_1.Param)('shopId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('suppliers/:shopId'),
    (0, roles_decorator_1.Roles)('vendor', 'admin'),
    __param(0, (0, common_1.Param)('shopId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getSuppliers", null);
__decorate([
    (0, common_1.Post)('suppliers/:shopId'),
    (0, roles_decorator_1.Roles)('vendor'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "addSupplier", null);
__decorate([
    (0, common_1.Get)('purchase-orders/:shopId'),
    (0, roles_decorator_1.Roles)('vendor', 'admin'),
    __param(0, (0, common_1.Param)('shopId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getPurchaseOrders", null);
__decorate([
    (0, common_1.Post)('purchase-orders/:shopId'),
    (0, roles_decorator_1.Roles)('vendor'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "createPurchaseOrder", null);
__decorate([
    (0, common_1.Post)('purchase-orders/:shopId/:poId/status'),
    (0, roles_decorator_1.Roles)('vendor'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, common_1.Param)('poId')),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "updatePOStatus", null);
exports.InventoryController = InventoryController = __decorate([
    (0, common_1.Controller)('inventory'),
    (0, common_1.UseGuards)(universal_auth_guard_1.UniversalAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map