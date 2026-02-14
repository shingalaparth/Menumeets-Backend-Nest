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
exports.MenuService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_service_1 = require("../../../infrastructure/external/cloudinary.service");
const menu_repository_1 = require("../domain/menu.repository");
const shop_service_1 = require("../../shop/application/shop.service");
const table_service_1 = require("../../table/application/table.service");
const redis_service_1 = require("../../../infrastructure/cache/redis.service");
const parseJSON = (val) => { try {
    return typeof val === 'string' ? JSON.parse(val) : val;
}
catch {
    return null;
} };
let MenuService = class MenuService {
    constructor(repo, shopService, tableService, redis, cloudinary) {
        this.repo = repo;
        this.shopService = shopService;
        this.tableService = tableService;
        this.redis = redis;
        this.cloudinary = cloudinary;
    }
    async clearMenuCache(shopId) {
        try {
            const tables = await this.tableService.getTablesForShopInternal(shopId);
            if (tables.length > 0) {
                const keys = tables.map(t => `menu:qr:${t.qrIdentifier}`);
                if (keys.length > 0)
                    await this.redis.del(...keys);
            }
        }
        catch (e) {
            console.error('Cache clear error:', e);
        }
    }
    async createCategory(shopId, vendor, body) {
        await this.shopService.checkOwnership(shopId, vendor);
        if (!body.name)
            throw new common_1.BadRequestException('Category name is required');
        const existing = await this.repo.findCategoryByNameAndShop(shopId, body.name.trim());
        if (existing)
            throw new common_1.BadRequestException('Category with this name already exists for this shop');
        const result = await this.repo.createCategory({
            name: body.name.trim(),
            nameHi: body.name_hi?.trim() || '',
            nameGu: body.name_gu?.trim() || '',
            description: body.description?.trim() || '',
            descriptionHi: body.description_hi?.trim() || '',
            descriptionGu: body.description_gu?.trim() || '',
            shopId,
            sortOrder: body.sortOrder || 0,
        });
        await this.clearMenuCache(shopId);
        return result;
    }
    async getShopCategories(shopId, vendor, status) {
        await this.shopService.checkOwnership(shopId, vendor);
        return this.repo.findCategoriesByShop(shopId, status === 'archived');
    }
    async updateCategory(shopId, categoryId, vendor, body) {
        await this.shopService.checkOwnership(shopId, vendor);
        const cat = await this.repo.findCategoryById(categoryId);
        if (!cat || cat.shopId !== shopId)
            throw new common_1.NotFoundException('Category not found in this shop');
        const result = await this.repo.updateCategory(categoryId, body);
        await this.clearMenuCache(shopId);
        return result;
    }
    async deleteCategory(shopId, categoryId, vendor) {
        await this.shopService.checkOwnership(shopId, vendor);
        const itemCount = await this.repo.countMenuItemsByCategory(categoryId);
        if (itemCount > 0) {
            throw new common_1.BadRequestException(`Cannot delete category. It contains ${itemCount} menu items. Please move or delete them first.`);
        }
        const cat = await this.repo.findCategoryById(categoryId);
        if (!cat || cat.shopId !== shopId)
            throw new common_1.NotFoundException('Category not found in this shop');
        await this.repo.updateCategory(categoryId, { isArchived: true, isActive: false, archivedAt: new Date() });
        await this.clearMenuCache(shopId);
        return { message: 'Category deleted successfully' };
    }
    async restoreCategory(shopId, categoryId, vendor) {
        await this.shopService.checkOwnership(shopId, vendor);
        const cat = await this.repo.findCategoryById(categoryId);
        if (!cat || cat.shopId !== shopId)
            throw new common_1.NotFoundException('Archived category not found.');
        const result = await this.repo.updateCategory(categoryId, { isArchived: false, isActive: true, archivedAt: null });
        await this.clearMenuCache(shopId);
        return result;
    }
    async permanentDeleteCategory(shopId, categoryId, vendor) {
        await this.shopService.checkOwnership(shopId, vendor);
        const itemCount = await this.repo.countMenuItemsByCategory(categoryId, true);
        if (itemCount > 0) {
            throw new common_1.BadRequestException(`Cannot permanently delete. It still contains ${itemCount} items. Please delete them first.`);
        }
        const cat = await this.repo.findCategoryById(categoryId);
        if (!cat || cat.shopId !== shopId)
            throw new common_1.NotFoundException('Category not found.');
        await this.repo.deleteCategory(categoryId);
        return { message: 'Category permanently deleted.' };
    }
    async createMenuItem(shopId, vendor, body, file) {
        await this.shopService.checkOwnership(shopId, vendor);
        if (!file)
            throw new common_1.BadRequestException('Please upload an image for the item.');
        if (!body.name || !body.categoryId) {
            await this.cloudinary.deleteImage(file.filename);
            throw new common_1.BadRequestException('Name and category are required.');
        }
        let parsedVariants = [];
        if (body.variants) {
            parsedVariants = parseJSON(body.variants);
            if (!parsedVariants) {
                await this.cloudinary.deleteImage(file.filename);
                throw new common_1.BadRequestException('Invalid format for variants.');
            }
        }
        let parsedAddOnGroups = [];
        if (body.addOnGroups) {
            parsedAddOnGroups = parseJSON(body.addOnGroups);
            if (!parsedAddOnGroups) {
                await this.cloudinary.deleteImage(file.filename);
                throw new common_1.BadRequestException('Invalid format for add-on groups.');
            }
        }
        const cat = await this.repo.findCategoryById(body.categoryId);
        if (!cat || cat.shopId !== shopId || cat.isArchived) {
            await this.cloudinary.deleteImage(file.filename);
            throw new common_1.BadRequestException('Invalid or archived category.');
        }
        const imgResult = await this.cloudinary.uploadImage(file.buffer, 'menu-items');
        const result = await this.repo.createMenuItem({
            name: body.name,
            nameHi: body.name_hi,
            nameGu: body.name_gu,
            description: body.description,
            descriptionHi: body.description_hi,
            descriptionGu: body.description_gu,
            price: body.price ? parseFloat(body.price) : undefined,
            shopId,
            categoryId: body.categoryId,
            image: { url: imgResult.secure_url, publicId: imgResult.public_id },
            variants: parsedVariants,
            addOnGroups: parsedAddOnGroups,
            isVegetarian: body.isVegetarian === 'true',
            preparationTime: body.preparationTime ? parseInt(body.preparationTime) : 15,
        });
        await this.clearMenuCache(shopId);
        return result;
    }
    async getShopMenuItems(shopId, vendor, archived) {
        await this.shopService.checkOwnership(shopId, vendor);
        return this.repo.findMenuItemsByShop(shopId, archived === 'true');
    }
    async getMenuItemById(itemId) {
        return this.repo.findMenuItemById(itemId);
    }
    async updateMenuItem(shopId, itemId, vendor, body, file) {
        await this.shopService.checkOwnership(shopId, vendor);
        const existing = await this.repo.findMenuItemById(itemId);
        if (!existing || existing.shopId !== shopId)
            throw new common_1.NotFoundException('Menu item not found.');
        const updateData = { ...body };
        if (updateData.categoryId) {
            const cat = await this.repo.findCategoryById(updateData.categoryId);
            if (!cat || cat.shopId !== shopId || cat.isArchived) {
                if (file)
                    await this.cloudinary.deleteImage(file.filename);
                throw new common_1.BadRequestException('Invalid or archived category.');
            }
            updateData.categoryId = updateData.categoryId;
        }
        if (updateData.variants && typeof updateData.variants === 'string') {
            const parsed = parseJSON(updateData.variants);
            if (!parsed)
                throw new common_1.BadRequestException('Invalid format for variants.');
            updateData.variants = parsed;
        }
        if (updateData.addOnGroups && typeof updateData.addOnGroups === 'string') {
            const parsed = parseJSON(updateData.addOnGroups);
            if (!parsed)
                throw new common_1.BadRequestException('Invalid format for add-on groups.');
            updateData.addOnGroups = parsed;
        }
        if (updateData.price)
            updateData.price = parseFloat(updateData.price);
        if (file) {
            const oldImage = existing.image;
            const imgResult = await this.cloudinary.uploadImage(file.buffer, 'menu-items');
            updateData.image = { url: imgResult.secure_url, publicId: imgResult.public_id };
            if (oldImage?.publicId) {
                await this.cloudinary.deleteImage(oldImage.publicId);
            }
        }
        const result = await this.repo.updateMenuItem(itemId, updateData);
        await this.clearMenuCache(shopId);
        return result;
    }
    async deleteMenuItem(shopId, itemId, vendor) {
        await this.shopService.checkOwnership(shopId, vendor);
        const item = await this.repo.findMenuItemById(itemId);
        if (!item || item.shopId !== shopId)
            throw new common_1.NotFoundException('Menu item not found in this shop');
        await this.repo.updateMenuItem(itemId, { isArchived: true, isAvailable: false, archivedAt: new Date() });
        await this.clearMenuCache(shopId);
        return { message: 'Menu item archived successfully.' };
    }
    async restoreMenuItem(shopId, itemId, vendor) {
        await this.shopService.checkOwnership(shopId, vendor);
        const item = await this.repo.findMenuItemById(itemId);
        if (!item || item.shopId !== shopId)
            throw new common_1.NotFoundException('Archived item not found.');
        const result = await this.repo.updateMenuItem(itemId, { isArchived: false, isAvailable: true, archivedAt: null });
        await this.clearMenuCache(shopId);
        return result;
    }
    async permanentDeleteMenuItem(shopId, itemId, vendor) {
        await this.shopService.checkOwnership(shopId, vendor);
        const item = await this.repo.findMenuItemById(itemId);
        if (!item || item.shopId !== shopId)
            throw new common_1.NotFoundException('Menu item not found.');
        const image = item.image;
        if (image?.publicId) {
            try {
                await this.cloudinary.deleteImage(image.publicId);
            }
            catch (e) {
                console.error('Image delete error:', e);
            }
        }
        await this.repo.deleteMenuItem(itemId);
        return { message: 'Menu item permanently deleted.' };
    }
    async toggleFavorite(shopId, itemId, vendor) {
        await this.shopService.checkOwnership(shopId, vendor);
        const item = await this.repo.findMenuItemById(itemId);
        if (!item || item.shopId !== shopId)
            throw new common_1.NotFoundException('Menu item not found');
        const newValue = !item.isFavorite;
        await this.repo.updateMenuItem(itemId, { isFavorite: newValue });
        await this.clearMenuCache(shopId);
        return { message: newValue ? 'Item added to favorites' : 'Item removed from favorites', data: { isFavorite: newValue } };
    }
    async getMenuByQrIdentifier(qrIdentifier) {
        const cacheKey = `menu:qr:${qrIdentifier}`;
        const cached = await this.redis.get(cacheKey);
        if (cached)
            return JSON.parse(cached);
        const table = await this.tableService.findTableByQr(qrIdentifier);
        if (!table)
            throw new common_1.NotFoundException('Invalid QR Code');
        if (!table.shopId) {
            throw new common_1.NotFoundException('This QR is not linked to a shop (Food Court support pending)');
        }
        const shop = await this.shopService.getShopById(table.shopId);
        if (!shop)
            throw new common_1.NotFoundException('Shop not found');
        const [categories, items] = await Promise.all([
            this.repo.findCategoriesByShop(table.shopId),
            this.repo.findMenuItemsByShop(table.shopId)
        ]);
        const menuByCategory = categories.map(cat => ({
            ...cat,
            items: items.filter(i => i.categoryId === cat.id)
        }));
        const responseData = {
            success: true,
            data: {
                isOpen: true,
                isFoodCourt: false,
                shop: {
                    name: shop.name,
                    address: shop.address,
                    phone: shop.phone,
                    isActive: shop.isActive,
                    upiQrCodeUrl: shop.upiQrCodeUrl,
                    settings: shop.settings,
                    businessType: shop.businessType
                },
                table: {
                    id: table.id,
                    tableNumber: table.tableNumber,
                    screen: table.screen,
                    totalRows: table.totalRows,
                    seatsPerRow: table.seatsPerRow,
                    totalCapacity: table.totalCapacity
                },
                menu: menuByCategory
            }
        };
        await this.redis.set(cacheKey, JSON.stringify(responseData), 3600);
        return responseData;
    }
};
exports.MenuService = MenuService;
exports.MenuService = MenuService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(menu_repository_1.MENU_REPOSITORY)),
    __metadata("design:paramtypes", [Object, shop_service_1.ShopService,
        table_service_1.TableService,
        redis_service_1.RedisService,
        cloudinary_service_1.CloudinaryService])
], MenuService);
//# sourceMappingURL=menu.service.js.map