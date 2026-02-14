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
exports.GlobalMenuService = void 0;
const common_1 = require("@nestjs/common");
const menu_repository_1 = require("../domain/menu.repository");
const cloudinary_service_1 = require("../../../infrastructure/external/cloudinary.service");
const shop_service_1 = require("../../shop/application/shop.service");
let GlobalMenuService = class GlobalMenuService {
    constructor(repo, cloudinary, shopService) {
        this.repo = repo;
        this.cloudinary = cloudinary;
        this.shopService = shopService;
    }
    async createGlobalCategory(body, file) {
        let imageUrl = null;
        if (file) {
            const uploaded = await this.cloudinary.uploadImage(file.buffer, 'global-categories');
            imageUrl = uploaded.secure_url;
        }
        return this.repo.createGlobalCategory({
            name: body.name,
            nameHi: body.nameHi,
            nameGu: body.nameGu,
            description: body.description,
            image: imageUrl,
            sortOrder: body.sortOrder ? parseInt(body.sortOrder) : 0
        });
    }
    async getGlobalCategories(isAdmin) {
        return this.repo.findGlobalCategories(isAdmin);
    }
    async updateGlobalCategory(id, body) {
        return this.repo.updateGlobalCategory(id, body);
    }
    async deleteGlobalCategory(id) {
        return this.repo.deleteGlobalCategory(id);
    }
    async createGlobalMenuItem(body, file) {
        let image = null;
        if (file) {
            const uploaded = await this.cloudinary.uploadImage(file.buffer, 'global-items');
            image = { url: uploaded.secure_url, publicId: uploaded.public_id };
        }
        const variants = body.variants ? (typeof body.variants === 'string' ? JSON.parse(body.variants) : body.variants) : [];
        const addOnGroups = body.addOnGroups ? (typeof body.addOnGroups === 'string' ? JSON.parse(body.addOnGroups) : body.addOnGroups) : [];
        const tags = body.tags ? (typeof body.tags === 'string' ? JSON.parse(body.tags) : body.tags) : [];
        return this.repo.createGlobalMenuItem({
            categoryId: body.categoryId,
            name: body.name,
            nameHi: body.nameHi,
            nameGu: body.nameGu,
            description: body.description,
            price: body.price ? parseFloat(body.price) : null,
            image,
            isVegetarian: body.isVegetarian === 'true' || body.isVegetarian === true,
            isVegan: body.isVegan === 'true' || body.isVegan === true,
            spiceLevel: body.spiceLevel || 'medium',
            variants,
            addOnGroups,
            tags
        });
    }
    async getGlobalItemsByCategory(categoryId, isAdmin) {
        return this.repo.findGlobalMenuItemsByCategory(categoryId, isAdmin);
    }
    async updateGlobalMenuItem(id, body) {
        return this.repo.updateGlobalMenuItem(id, body);
    }
    async deleteGlobalMenuItem(id) {
        return this.repo.deleteGlobalMenuItem(id);
    }
    async cloneGlobalItemToShop(shopId, globalItemId, targetCategoryId, vendor) {
        await this.shopService.checkOwnership(shopId, vendor);
        const globalItem = await this.repo.findGlobalMenuItemById(globalItemId);
        if (!globalItem)
            throw new common_1.NotFoundException("Global item not found");
        const category = await this.repo.findCategoryById(targetCategoryId);
        if (!category || category.shopId !== shopId)
            throw new common_1.BadRequestException("Invalid target category");
        const clonedImage = globalItem.image ? { url: globalItem.image.url, publicId: null } : undefined;
        return this.repo.createMenuItem({
            shopId,
            categoryId: targetCategoryId,
            name: globalItem.name,
            nameHi: globalItem.nameHi,
            nameGu: globalItem.nameGu,
            description: globalItem.description,
            price: globalItem.price || 0,
            image: clonedImage,
            isVegetarian: globalItem.isVegetarian,
            isVegan: globalItem.isVegan,
            spiceLevel: globalItem.spiceLevel,
            variants: globalItem.variants,
            addOnGroups: globalItem.addOnGroups,
            tags: globalItem.tags,
            sourceGlobalItemId: globalItem.id
        });
    }
};
exports.GlobalMenuService = GlobalMenuService;
exports.GlobalMenuService = GlobalMenuService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(menu_repository_1.MENU_REPOSITORY)),
    __metadata("design:paramtypes", [Object, cloudinary_service_1.CloudinaryService,
        shop_service_1.ShopService])
], GlobalMenuService);
//# sourceMappingURL=global-menu.service.js.map