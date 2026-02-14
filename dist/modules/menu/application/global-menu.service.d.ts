import { MenuRepository } from '../domain/menu.repository';
import { CloudinaryService } from '../../../infrastructure/external/cloudinary.service';
import { ShopService } from '../../shop/application/shop.service';
export declare class GlobalMenuService {
    private repo;
    private cloudinary;
    private shopService;
    constructor(repo: MenuRepository, cloudinary: CloudinaryService, shopService: ShopService);
    createGlobalCategory(body: any, file?: Express.Multer.File): Promise<any>;
    getGlobalCategories(isAdmin: boolean): Promise<any[]>;
    updateGlobalCategory(id: string, body: any): Promise<any>;
    deleteGlobalCategory(id: string): Promise<void>;
    createGlobalMenuItem(body: any, file?: Express.Multer.File): Promise<any>;
    getGlobalItemsByCategory(categoryId: string, isAdmin: boolean): Promise<any[]>;
    updateGlobalMenuItem(id: string, body: any): Promise<any>;
    deleteGlobalMenuItem(id: string): Promise<void>;
    cloneGlobalItemToShop(shopId: string, globalItemId: string, targetCategoryId: string, vendor: any): Promise<import("../domain/menu.entity").MenuItemEntity>;
}
