import { GlobalMenuService } from '../application/global-menu.service';
export declare class GlobalMenuController {
    private readonly service;
    constructor(service: GlobalMenuService);
    createCategory(body: any, file: Express.Multer.File): Promise<any>;
    getCategories(user: any): Promise<any[]>;
    updateCategory(id: string, body: any): Promise<any>;
    deleteCategory(id: string): Promise<void>;
    createItem(body: any, file: Express.Multer.File): Promise<any>;
    getItems(categoryId: string, user: any): Promise<any[]>;
    updateItem(id: string, body: any): Promise<any>;
    deleteItem(id: string): Promise<void>;
    cloneItem(body: {
        shopId: string;
        globalItemId: string;
        targetCategoryId: string;
    }, vendor: any): Promise<import("../domain/menu.entity").MenuItemEntity>;
}
