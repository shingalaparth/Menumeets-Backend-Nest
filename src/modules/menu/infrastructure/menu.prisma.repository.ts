import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { MenuRepository } from '../domain/menu.repository';
import { CategoryEntity, MenuItemEntity, CreateCategoryData, CreateMenuItemData } from '../domain/menu.entity';

@Injectable()
export class MenuPrismaRepository implements MenuRepository {
    constructor(private prisma: PrismaService) { }

    // ── Categories ──

    async findCategoryById(id: string): Promise<CategoryEntity | null> {
        return this.prisma.category.findUnique({ where: { id } }) as unknown as CategoryEntity | null;
    }

    async findCategoriesByShop(shopId: string, includeArchived = false): Promise<CategoryEntity[]> {
        return this.prisma.category.findMany({
            where: { shopId, isArchived: includeArchived ? undefined : false },
            orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        }) as unknown as CategoryEntity[];
    }

    async findCategoryByNameAndShop(shopId: string, name: string): Promise<CategoryEntity | null> {
        return this.prisma.category.findFirst({
            where: { shopId, name: { equals: name, mode: 'insensitive' } },
        }) as unknown as CategoryEntity | null;
    }

    async createCategory(data: CreateCategoryData): Promise<CategoryEntity> {
        return this.prisma.category.create({ data }) as unknown as CategoryEntity;
    }

    async updateCategory(id: string, data: Partial<CategoryEntity>): Promise<CategoryEntity> {
        return this.prisma.category.update({ where: { id }, data: data as any }) as unknown as CategoryEntity;
    }

    async deleteCategory(id: string): Promise<void> {
        await this.prisma.category.delete({ where: { id } });
    }

    // ── Menu Items ──

    async findMenuItemById(id: string): Promise<MenuItemEntity | null> {
        return this.prisma.menuItem.findUnique({ where: { id } }) as unknown as MenuItemEntity | null;
    }

    async findMenuItemsByShop(shopId: string, includeArchived = false): Promise<MenuItemEntity[]> {
        return this.prisma.menuItem.findMany({
            where: { shopId, isArchived: includeArchived ? undefined : false },
            include: { category: { select: { name: true, isArchived: true } } },
            orderBy: [{ sortOrder: 'asc' }],
        }) as unknown as MenuItemEntity[];
    }

    async countMenuItemsByCategory(categoryId: string, includeArchived = false): Promise<number> {
        return this.prisma.menuItem.count({
            where: { categoryId, isArchived: includeArchived ? undefined : false },
        });
    }

    async createMenuItem(data: CreateMenuItemData): Promise<MenuItemEntity> {
        return this.prisma.menuItem.create({ data: data as any }) as unknown as MenuItemEntity;
    }

    async updateMenuItem(id: string, data: Partial<MenuItemEntity>): Promise<MenuItemEntity> {
        return this.prisma.menuItem.update({ where: { id }, data: data as any }) as unknown as MenuItemEntity;
    }

    async deleteMenuItem(id: string): Promise<void> {
        await this.prisma.menuItem.delete({ where: { id } });
    }

    // ── Global Categories ──

    async createGlobalCategory(data: any): Promise<any> {
        return this.prisma.globalCategory.create({ data });
    }

    async findGlobalCategories(includeInactive = false): Promise<any[]> {
        return this.prisma.globalCategory.findMany({
            where: { isActive: includeInactive ? undefined : true },
            orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }]
        });
    }

    async findGlobalCategoryById(id: string): Promise<any> {
        return this.prisma.globalCategory.findUnique({ where: { id } });
    }

    async updateGlobalCategory(id: string, data: any): Promise<any> {
        return this.prisma.globalCategory.update({ where: { id }, data });
    }

    async deleteGlobalCategory(id: string): Promise<void> {
        await this.prisma.globalCategory.delete({ where: { id } });
    }

    // ── Global Menu Items ──

    async createGlobalMenuItem(data: any): Promise<any> {
        return this.prisma.globalMenuItem.create({ data });
    }

    async findGlobalMenuItemsByCategory(categoryId: string, includeInactive = false): Promise<any[]> {
        return this.prisma.globalMenuItem.findMany({
            where: { categoryId, isActive: includeInactive ? undefined : true },
        });
    }

    async findGlobalMenuItemById(id: string): Promise<any> {
        return this.prisma.globalMenuItem.findUnique({ where: { id } });
    }

    async updateGlobalMenuItem(id: string, data: any): Promise<any> {
        return this.prisma.globalMenuItem.update({ where: { id }, data });
    }

    async deleteGlobalMenuItem(id: string): Promise<void> {
        await this.prisma.globalMenuItem.delete({ where: { id } });
    }
}
