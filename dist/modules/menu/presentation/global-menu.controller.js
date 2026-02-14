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
exports.GlobalMenuController = void 0;
const common_1 = require("@nestjs/common");
const global_menu_service_1 = require("../application/global-menu.service");
const roles_decorator_1 = require("../../../shared/decorators/roles.decorator");
const roles_guard_1 = require("../../../shared/guards/roles.guard");
const universal_auth_guard_1 = require("../../../shared/guards/universal-auth.guard");
const platform_express_1 = require("@nestjs/platform-express");
const current_user_decorator_1 = require("../../../shared/decorators/current-user.decorator");
let GlobalMenuController = class GlobalMenuController {
    constructor(service) {
        this.service = service;
    }
    createCategory(body, file) {
        return this.service.createGlobalCategory(body, file);
    }
    getCategories(user) {
        const isAdmin = user.role === 'admin';
        return this.service.getGlobalCategories(isAdmin);
    }
    updateCategory(id, body) {
        return this.service.updateGlobalCategory(id, body);
    }
    deleteCategory(id) {
        return this.service.deleteGlobalCategory(id);
    }
    createItem(body, file) {
        return this.service.createGlobalMenuItem(body, file);
    }
    getItems(categoryId, user) {
        const isAdmin = user.role === 'admin';
        return this.service.getGlobalItemsByCategory(categoryId, isAdmin);
    }
    updateItem(id, body) {
        return this.service.updateGlobalMenuItem(id, body);
    }
    deleteItem(id) {
        return this.service.deleteGlobalMenuItem(id);
    }
    cloneItem(body, vendor) {
        return this.service.cloneGlobalItemToShop(body.shopId, body.globalItemId, body.targetCategoryId, vendor);
    }
};
exports.GlobalMenuController = GlobalMenuController;
__decorate([
    (0, common_1.Post)('categories'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], GlobalMenuController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Get)('categories'),
    (0, roles_decorator_1.Roles)('admin', 'vendor'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GlobalMenuController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Patch)('categories/:id'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GlobalMenuController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:id'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GlobalMenuController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Post)('items'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], GlobalMenuController.prototype, "createItem", null);
__decorate([
    (0, common_1.Get)('categories/:categoryId/items'),
    (0, roles_decorator_1.Roles)('admin', 'vendor'),
    __param(0, (0, common_1.Param)('categoryId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GlobalMenuController.prototype, "getItems", null);
__decorate([
    (0, common_1.Patch)('items/:id'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GlobalMenuController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Delete)('items/:id'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GlobalMenuController.prototype, "deleteItem", null);
__decorate([
    (0, common_1.Post)('clone-item'),
    (0, roles_decorator_1.Roles)('vendor'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], GlobalMenuController.prototype, "cloneItem", null);
exports.GlobalMenuController = GlobalMenuController = __decorate([
    (0, common_1.Controller)('admin/global-menu'),
    (0, common_1.UseGuards)(universal_auth_guard_1.UniversalAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [global_menu_service_1.GlobalMenuService])
], GlobalMenuController);
//# sourceMappingURL=global-menu.controller.js.map