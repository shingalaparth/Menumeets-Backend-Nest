/**
 * Menu Service — Application layer
 * Handles Category + MenuItem business logic.
 * Migrated from category.controller.js (206L) + menu.controller.js (366L).
 */
import {
    Injectable,
    Inject,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { CloudinaryService } from '../../../infrastructure/external/cloudinary.service';
import { MENU_REPOSITORY, MenuRepository } from '../domain/menu.repository';
import { ShopService } from '../../shop/application/shop.service';
import { TableService } from '../../table/application/table.service';
import { RedisService } from '../../../infrastructure/cache/redis.service';

const parseJSON = (val: any) => { try { return typeof val === 'string' ? JSON.parse(val) : val; } catch { return null; } };

@Injectable()
export class MenuService {
    constructor(
        @Inject(MENU_REPOSITORY) private repo: MenuRepository,
        private shopService: ShopService,
        private tableService: TableService,
        private redis: RedisService,
        private cloudinary: CloudinaryService,
    ) { }

    private async clearMenuCache(shopId: string) {
        try {
            const tables = await this.tableService.getTablesForShopInternal(shopId);
            if (tables.length > 0) {
                const keys = tables.map(t => `menu:qr:${t.qrIdentifier}`);
                if (keys.length > 0) await this.redis.del(...keys);
            }
        } catch (e) {
            console.error('Cache clear error:', e);
        }
    }

    // ═══════════════════════════════════
    //  CATEGORIES
    // ═══════════════════════════════════

    async createCategory(shopId: string, vendor: any, body: any) {
        await this.shopService.checkOwnership(shopId, vendor);
        if (!body.name) throw new BadRequestException('Category name is required');

        const existing = await this.repo.findCategoryByNameAndShop(shopId, body.name.trim());
        if (existing) throw new BadRequestException('Category with this name already exists for this shop');

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

    async getShopCategories(shopId: string, vendor: any, status?: string) {
        await this.shopService.checkOwnership(shopId, vendor);
        return this.repo.findCategoriesByShop(shopId, status === 'archived');
    }

    async updateCategory(shopId: string, categoryId: string, vendor: any, body: any) {
        await this.shopService.checkOwnership(shopId, vendor);
        const cat = await this.repo.findCategoryById(categoryId);
        if (!cat || cat.shopId !== shopId) throw new NotFoundException('Category not found in this shop');
        const result = await this.repo.updateCategory(categoryId, body);
        await this.clearMenuCache(shopId);
        return result;
    }

    async deleteCategory(shopId: string, categoryId: string, vendor: any) {
        await this.shopService.checkOwnership(shopId, vendor);
        const itemCount = await this.repo.countMenuItemsByCategory(categoryId);
        if (itemCount > 0) {
            throw new BadRequestException(`Cannot delete category. It contains ${itemCount} menu items. Please move or delete them first.`);
        }
        const cat = await this.repo.findCategoryById(categoryId);
        if (!cat || cat.shopId !== shopId) throw new NotFoundException('Category not found in this shop');
        await this.repo.updateCategory(categoryId, { isArchived: true, isActive: false, archivedAt: new Date() });
        await this.clearMenuCache(shopId);
        return { message: 'Category deleted successfully' };
    }

    async restoreCategory(shopId: string, categoryId: string, vendor: any) {
        await this.shopService.checkOwnership(shopId, vendor);
        const cat = await this.repo.findCategoryById(categoryId);
        if (!cat || cat.shopId !== shopId) throw new NotFoundException('Archived category not found.');
        const result = await this.repo.updateCategory(categoryId, { isArchived: false, isActive: true, archivedAt: null });
        await this.clearMenuCache(shopId);
        return result;
    }

    async permanentDeleteCategory(shopId: string, categoryId: string, vendor: any) {
        await this.shopService.checkOwnership(shopId, vendor);
        const itemCount = await this.repo.countMenuItemsByCategory(categoryId, true);
        if (itemCount > 0) {
            throw new BadRequestException(`Cannot permanently delete. It still contains ${itemCount} items. Please delete them first.`);
        }
        const cat = await this.repo.findCategoryById(categoryId);
        if (!cat || cat.shopId !== shopId) throw new NotFoundException('Category not found.');
        await this.repo.deleteCategory(categoryId);
        return { message: 'Category permanently deleted.' };
    }

    // ═══════════════════════════════════
    //  MENU ITEMS
    // ═══════════════════════════════════

    async createMenuItem(shopId: string, vendor: any, body: any, file?: Express.Multer.File) {
        await this.shopService.checkOwnership(shopId, vendor);

        if (!file) throw new BadRequestException('Please upload an image for the item.');
        if (!body.name || !body.categoryId) {
            await this.cloudinary.deleteImage(file.filename);
            throw new BadRequestException('Name and category are required.');
        }

        // Parse variants & addOns
        let parsedVariants: any[] = [];
        if (body.variants) {
            parsedVariants = parseJSON(body.variants);
            if (!parsedVariants) { await this.cloudinary.deleteImage(file.filename); throw new BadRequestException('Invalid format for variants.'); }
        }
        let parsedAddOnGroups: any[] = [];
        if (body.addOnGroups) {
            parsedAddOnGroups = parseJSON(body.addOnGroups);
            if (!parsedAddOnGroups) { await this.cloudinary.deleteImage(file.filename); throw new BadRequestException('Invalid format for add-on groups.'); }
        }

        // Validate category
        const cat = await this.repo.findCategoryById(body.categoryId);
        if (!cat || cat.shopId !== shopId || cat.isArchived) {
            await this.cloudinary.deleteImage(file.filename);
            throw new BadRequestException('Invalid or archived category.');
        }

        // Upload image
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

    async getShopMenuItems(shopId: string, vendor: any, archived?: string) {
        await this.shopService.checkOwnership(shopId, vendor);
        return this.repo.findMenuItemsByShop(shopId, archived === 'true');
    }

    // Helper for Cart/Order Services
    async getMenuItemById(itemId: string) {
        return this.repo.findMenuItemById(itemId);
    }

    async updateMenuItem(shopId: string, itemId: string, vendor: any, body: any, file?: Express.Multer.File) {
        await this.shopService.checkOwnership(shopId, vendor);
        const existing = await this.repo.findMenuItemById(itemId);
        if (!existing || existing.shopId !== shopId) throw new NotFoundException('Menu item not found.');

        const updateData: any = { ...body };

        // Validate category change
        if (updateData.categoryId) {
            const cat = await this.repo.findCategoryById(updateData.categoryId);
            if (!cat || cat.shopId !== shopId || cat.isArchived) {
                if (file) await this.cloudinary.deleteImage(file.filename);
                throw new BadRequestException('Invalid or archived category.');
            }
            updateData.categoryId = updateData.categoryId;
        }

        // Parse JSON fields
        if (updateData.variants && typeof updateData.variants === 'string') {
            const parsed = parseJSON(updateData.variants);
            if (!parsed) throw new BadRequestException('Invalid format for variants.');
            updateData.variants = parsed;
        }
        if (updateData.addOnGroups && typeof updateData.addOnGroups === 'string') {
            const parsed = parseJSON(updateData.addOnGroups);
            if (!parsed) throw new BadRequestException('Invalid format for add-on groups.');
            updateData.addOnGroups = parsed;
        }
        if (updateData.price) updateData.price = parseFloat(updateData.price);

        // Handle image replacement
        if (file) {
            const oldImage = existing.image as any;
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

    async deleteMenuItem(shopId: string, itemId: string, vendor: any) {
        await this.shopService.checkOwnership(shopId, vendor);
        const item = await this.repo.findMenuItemById(itemId);
        if (!item || item.shopId !== shopId) throw new NotFoundException('Menu item not found in this shop');
        await this.repo.updateMenuItem(itemId, { isArchived: true, isAvailable: false, archivedAt: new Date() });
        await this.clearMenuCache(shopId);
        return { message: 'Menu item archived successfully.' };
    }

    async restoreMenuItem(shopId: string, itemId: string, vendor: any) {
        await this.shopService.checkOwnership(shopId, vendor);
        const item = await this.repo.findMenuItemById(itemId);
        if (!item || item.shopId !== shopId) throw new NotFoundException('Archived item not found.');
        const result = await this.repo.updateMenuItem(itemId, { isArchived: false, isAvailable: true, archivedAt: null });
        await this.clearMenuCache(shopId);
        return result;
    }

    async permanentDeleteMenuItem(shopId: string, itemId: string, vendor: any) {
        await this.shopService.checkOwnership(shopId, vendor);
        const item = await this.repo.findMenuItemById(itemId);
        if (!item || item.shopId !== shopId) throw new NotFoundException('Menu item not found.');
        const image = item.image as any;
        if (image?.publicId) {
            try { await this.cloudinary.deleteImage(image.publicId); } catch (e) { console.error('Image delete error:', e); }
        }
        await this.repo.deleteMenuItem(itemId);
        return { message: 'Menu item permanently deleted.' };
    }

    async toggleFavorite(shopId: string, itemId: string, vendor: any) {
        await this.shopService.checkOwnership(shopId, vendor);
        const item = await this.repo.findMenuItemById(itemId);
        if (!item || item.shopId !== shopId) throw new NotFoundException('Menu item not found');
        const newValue = !item.isFavorite;
        await this.repo.updateMenuItem(itemId, { isFavorite: newValue });
        await this.clearMenuCache(shopId);
        return { message: newValue ? 'Item added to favorites' : 'Item removed from favorites', data: { isFavorite: newValue } };
    }

    // ═══════════════════════════════════
    //  PUBLIC MENU (QR)
    // ═══════════════════════════════════

    async getMenuByQrIdentifier(qrIdentifier: string) {
        // 1. Check Cache
        const cacheKey = `menu:qr:${qrIdentifier}`;
        const cached = await this.redis.get(cacheKey);
        if (cached) return JSON.parse(cached);

        // 2. Identify Table
        const table = await this.tableService.findTableByQr(qrIdentifier);
        if (!table) throw new NotFoundException('Invalid QR Code');

        // Food Court logic deferred (Phase 6b) - assumes Single Shop for now (Phase 6a)
        if (!table.shopId) {
            // If FC table, we would fetch FC logic. But we are in Shop Phase.
            // For now return error or handle gracefully.
            throw new NotFoundException('This QR is not linked to a shop (Food Court support pending)');
        }

        const shop = await this.shopService.getShopById(table.shopId);
        if (!shop) throw new NotFoundException('Shop not found');

        // 3. Fetch Menu
        const [categories, items] = await Promise.all([
            this.repo.findCategoriesByShop(table.shopId),
            this.repo.findMenuItemsByShop(table.shopId)
        ]);

        // 4. Organize
        const menuByCategory = categories.map(cat => ({
            ...cat,
            items: items.filter(i => i.categoryId === cat.id)
        }));

        const responseData = {
            success: true,
            data: {
                isOpen: true, // Need to check shop timings (deferred)
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

        // 5. Cache
        await this.redis.set(cacheKey, JSON.stringify(responseData), 3600);
        return responseData;
    }
}
