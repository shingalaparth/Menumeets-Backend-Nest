import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { MenuRepository } from '../domain/menu.repository';
import { CategoryEntity, MenuItemEntity, CreateCategoryData, CreateMenuItemData } from '../domain/menu.entity';
export declare class MenuPrismaRepository implements MenuRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findCategoryById(id: string): Promise<CategoryEntity | null>;
    findCategoriesByShop(shopId: string, includeArchived?: boolean): Promise<CategoryEntity[]>;
    findCategoryByNameAndShop(shopId: string, name: string): Promise<CategoryEntity | null>;
    createCategory(data: CreateCategoryData): Promise<CategoryEntity>;
    updateCategory(id: string, data: Partial<CategoryEntity>): Promise<CategoryEntity>;
    deleteCategory(id: string): Promise<void>;
    findMenuItemById(id: string): Promise<MenuItemEntity | null>;
    findMenuItemsByShop(shopId: string, includeArchived?: boolean): Promise<MenuItemEntity[]>;
    countMenuItemsByCategory(categoryId: string, includeArchived?: boolean): Promise<number>;
    createMenuItem(data: CreateMenuItemData): Promise<MenuItemEntity>;
    updateMenuItem(id: string, data: Partial<MenuItemEntity>): Promise<MenuItemEntity>;
    deleteMenuItem(id: string): Promise<void>;
    createGlobalCategory(data: any): Promise<any>;
    findGlobalCategories(includeInactive?: boolean): Promise<any[]>;
    findGlobalCategoryById(id: string): Promise<any>;
    updateGlobalCategory(id: string, data: any): Promise<any>;
    deleteGlobalCategory(id: string): Promise<void>;
    createGlobalMenuItem(data: any): Promise<any>;
    findGlobalMenuItemsByCategory(categoryId: string, includeInactive?: boolean): Promise<any[]>;
    findGlobalMenuItemById(id: string): Promise<any>;
    updateGlobalMenuItem(id: string, data: any): Promise<any>;
    deleteGlobalMenuItem(id: string): Promise<void>;
}
