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
exports.MenuController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const vendor_auth_guard_1 = require("../../../shared/guards/vendor-auth.guard");
const current_user_decorator_1 = require("../../../shared/decorators/current-user.decorator");
const menu_service_1 = require("../application/menu.service");
let MenuController = class MenuController {
    constructor(menuService) {
        this.menuService = menuService;
    }
    createCategory(shopId, vendor, body) {
        return this.menuService.createCategory(shopId, vendor, body);
    }
    getShopCategories(shopId, vendor, status) {
        return this.menuService.getShopCategories(shopId, vendor, status);
    }
    updateCategory(shopId, catId, vendor, body) {
        return this.menuService.updateCategory(shopId, catId, vendor, body);
    }
    deleteCategory(shopId, catId, vendor) {
        return this.menuService.deleteCategory(shopId, catId, vendor);
    }
    restoreCategory(shopId, catId, vendor) {
        return this.menuService.restoreCategory(shopId, catId, vendor);
    }
    permanentDeleteCategory(shopId, catId, vendor) {
        return this.menuService.permanentDeleteCategory(shopId, catId, vendor);
    }
    createMenuItem(shopId, vendor, body, file) {
        return this.menuService.createMenuItem(shopId, vendor, body, file);
    }
    getShopMenuItems(shopId, vendor, archived) {
        return this.menuService.getShopMenuItems(shopId, vendor, archived);
    }
    updateMenuItem(shopId, itemId, vendor, body, file) {
        return this.menuService.updateMenuItem(shopId, itemId, vendor, body, file);
    }
    deleteMenuItem(shopId, itemId, vendor) {
        return this.menuService.deleteMenuItem(shopId, itemId, vendor);
    }
    restoreMenuItem(shopId, itemId, vendor) {
        return this.menuService.restoreMenuItem(shopId, itemId, vendor);
    }
    permanentDeleteMenuItem(shopId, itemId, vendor) {
        return this.menuService.permanentDeleteMenuItem(shopId, itemId, vendor);
    }
    toggleFavorite(shopId, itemId, vendor) {
        return this.menuService.toggleFavorite(shopId, itemId, vendor);
    }
};
exports.MenuController = MenuController;
__decorate([
    (0, common_1.Post)('categories'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, current_user_decorator_1.CurrentVendor)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Get)('categories'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, current_user_decorator_1.CurrentVendor)()),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "getShopCategories", null);
__decorate([
    (0, common_1.Put)('categories/:categoryId'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, common_1.Param)('categoryId')),
    __param(2, (0, current_user_decorator_1.CurrentVendor)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:categoryId'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, common_1.Param)('categoryId')),
    __param(2, (0, current_user_decorator_1.CurrentVendor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Patch)('categories/:categoryId/restore'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, common_1.Param)('categoryId')),
    __param(2, (0, current_user_decorator_1.CurrentVendor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "restoreCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:categoryId/permanent'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, common_1.Param)('categoryId')),
    __param(2, (0, current_user_decorator_1.CurrentVendor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "permanentDeleteCategory", null);
__decorate([
    (0, common_1.Post)('menu'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, current_user_decorator_1.CurrentVendor)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "createMenuItem", null);
__decorate([
    (0, common_1.Get)('menu'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, current_user_decorator_1.CurrentVendor)()),
    __param(2, (0, common_1.Query)('archived')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "getShopMenuItems", null);
__decorate([
    (0, common_1.Put)('menu/:itemId'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, current_user_decorator_1.CurrentVendor)()),
    __param(3, (0, common_1.Body)()),
    __param(4, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "updateMenuItem", null);
__decorate([
    (0, common_1.Delete)('menu/:itemId'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, current_user_decorator_1.CurrentVendor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "deleteMenuItem", null);
__decorate([
    (0, common_1.Patch)('menu/:itemId/restore'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, current_user_decorator_1.CurrentVendor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "restoreMenuItem", null);
__decorate([
    (0, common_1.Delete)('menu/:itemId/permanent'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, current_user_decorator_1.CurrentVendor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "permanentDeleteMenuItem", null);
__decorate([
    (0, common_1.Patch)('menu/:itemId/favorite'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, current_user_decorator_1.CurrentVendor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "toggleFavorite", null);
exports.MenuController = MenuController = __decorate([
    (0, common_1.Controller)('shops/:shopId'),
    (0, common_1.UseGuards)(vendor_auth_guard_1.VendorAuthGuard),
    __metadata("design:paramtypes", [menu_service_1.MenuService])
], MenuController);
//# sourceMappingURL=menu.controller.js.map