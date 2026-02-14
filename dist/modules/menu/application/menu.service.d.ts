import { CloudinaryService } from '../../../infrastructure/external/cloudinary.service';
import { MenuRepository } from '../domain/menu.repository';
import { ShopService } from '../../shop/application/shop.service';
import { TableService } from '../../table/application/table.service';
import { RedisService } from '../../../infrastructure/cache/redis.service';
export declare class MenuService {
    private repo;
    private shopService;
    private tableService;
    private redis;
    private cloudinary;
    constructor(repo: MenuRepository, shopService: ShopService, tableService: TableService, redis: RedisService, cloudinary: CloudinaryService);
    private clearMenuCache;
    createCategory(shopId: string, vendor: any, body: any): Promise<import("../domain/menu.entity").CategoryEntity>;
    getShopCategories(shopId: string, vendor: any, status?: string): Promise<import("../domain/menu.entity").CategoryEntity[]>;
    updateCategory(shopId: string, categoryId: string, vendor: any, body: any): Promise<import("../domain/menu.entity").CategoryEntity>;
    deleteCategory(shopId: string, categoryId: string, vendor: any): Promise<{
        message: string;
    }>;
    restoreCategory(shopId: string, categoryId: string, vendor: any): Promise<import("../domain/menu.entity").CategoryEntity>;
    permanentDeleteCategory(shopId: string, categoryId: string, vendor: any): Promise<{
        message: string;
    }>;
    createMenuItem(shopId: string, vendor: any, body: any, file?: Express.Multer.File): Promise<import("../domain/menu.entity").MenuItemEntity>;
    getShopMenuItems(shopId: string, vendor: any, archived?: string): Promise<import("../domain/menu.entity").MenuItemEntity[]>;
    getMenuItemById(itemId: string): Promise<import("../domain/menu.entity").MenuItemEntity | null>;
    updateMenuItem(shopId: string, itemId: string, vendor: any, body: any, file?: Express.Multer.File): Promise<import("../domain/menu.entity").MenuItemEntity>;
    deleteMenuItem(shopId: string, itemId: string, vendor: any): Promise<{
        message: string;
    }>;
    restoreMenuItem(shopId: string, itemId: string, vendor: any): Promise<import("../domain/menu.entity").MenuItemEntity>;
    permanentDeleteMenuItem(shopId: string, itemId: string, vendor: any): Promise<{
        message: string;
    }>;
    toggleFavorite(shopId: string, itemId: string, vendor: any): Promise<{
        message: string;
        data: {
            isFavorite: boolean;
        };
    }>;
    getMenuByQrIdentifier(qrIdentifier: string): Promise<any>;
}
