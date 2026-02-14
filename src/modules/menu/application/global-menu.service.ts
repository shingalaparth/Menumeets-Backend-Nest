import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { MENU_REPOSITORY, MenuRepository } from '../domain/menu.repository';
import { CloudinaryService } from '../../../infrastructure/external/cloudinary.service';
import { ShopService } from '../../shop/application/shop.service';

@Injectable()
export class GlobalMenuService {
    constructor(
        @Inject(MENU_REPOSITORY) private repo: MenuRepository,
        private cloudinary: CloudinaryService,
        private shopService: ShopService // Needed for ownership check in Clone
    ) { }

    // ── Global Categories ──

    async createGlobalCategory(body: any, file?: Express.Multer.File) {
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

    async getGlobalCategories(isAdmin: boolean) {
        return this.repo.findGlobalCategories(isAdmin); // Admins see inactive too
    }

    async updateGlobalCategory(id: string, body: any) {
        return this.repo.updateGlobalCategory(id, body);
    }

    async deleteGlobalCategory(id: string) {
        return this.repo.deleteGlobalCategory(id);
    }

    // ── Global Menu Items ──

    async createGlobalMenuItem(body: any, file?: Express.Multer.File) {
        let image = null;
        if (file) {
            const uploaded = await this.cloudinary.uploadImage(file.buffer, 'global-items');
            image = { url: uploaded.secure_url, publicId: uploaded.public_id };
        }

        // Parse JSON fields
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

    async getGlobalItemsByCategory(categoryId: string, isAdmin: boolean) {
        return this.repo.findGlobalMenuItemsByCategory(categoryId, isAdmin);
    }

    async updateGlobalMenuItem(id: string, body: any) {
        return this.repo.updateGlobalMenuItem(id, body);
    }

    async deleteGlobalMenuItem(id: string) {
        return this.repo.deleteGlobalMenuItem(id);
    }

    // ── Cloning Feature ──
    async cloneGlobalItemToShop(shopId: string, globalItemId: string, targetCategoryId: string, vendor: any) {
        // 1. Verify Ownership
        await this.shopService.checkOwnership(shopId, vendor);

        // 2. Fetch Global Item
        const globalItem = await this.repo.findGlobalMenuItemById(globalItemId);
        if (!globalItem) throw new NotFoundException("Global item not found");

        // 3. Verify Target Category
        const category = await this.repo.findCategoryById(targetCategoryId);
        if (!category || category.shopId !== shopId) throw new BadRequestException("Invalid target category");

        // 4. Create Shop Menu Item (Clone)
        // We copy details but NOT the image publicId to avoid deleting the global image if shop item is deleted.
        // We just link the URL. Or better, we should probably not link publicId if we want to protect global asset.
        // However, MenuService delete logic checks for publicId to delete from Cloudinary.
        // If we share the publicId, a shop owner deleting their item might delete the global image!
        // SAFEGUARD: Do not copy publicId. Just copy URL.

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
            sourceGlobalItemId: globalItem.id // Link for future reference/updates
        });
    }
}
