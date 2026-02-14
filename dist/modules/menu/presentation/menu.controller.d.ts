import { MenuService } from '../application/menu.service';
export declare class MenuController {
    private menuService;
    constructor(menuService: MenuService);
    createCategory(shopId: string, vendor: any, body: any): Promise<import("../domain/menu.entity").CategoryEntity>;
    getShopCategories(shopId: string, vendor: any, status?: string): Promise<import("../domain/menu.entity").CategoryEntity[]>;
    updateCategory(shopId: string, catId: string, vendor: any, body: any): Promise<import("../domain/menu.entity").CategoryEntity>;
    deleteCategory(shopId: string, catId: string, vendor: any): Promise<{
        message: string;
    }>;
    restoreCategory(shopId: string, catId: string, vendor: any): Promise<import("../domain/menu.entity").CategoryEntity>;
    permanentDeleteCategory(shopId: string, catId: string, vendor: any): Promise<{
        message: string;
    }>;
    createMenuItem(shopId: string, vendor: any, body: any, file: Express.Multer.File): Promise<import("../domain/menu.entity").MenuItemEntity>;
    getShopMenuItems(shopId: string, vendor: any, archived?: string): Promise<import("../domain/menu.entity").MenuItemEntity[]>;
    updateMenuItem(shopId: string, itemId: string, vendor: any, body: any, file: Express.Multer.File): Promise<import("../domain/menu.entity").MenuItemEntity>;
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
}
