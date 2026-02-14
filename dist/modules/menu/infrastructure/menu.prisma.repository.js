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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuPrismaRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../infrastructure/database/prisma.service");
let MenuPrismaRepository = class MenuPrismaRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findCategoryById(id) {
        return this.prisma.category.findUnique({ where: { id } });
    }
    async findCategoriesByShop(shopId, includeArchived = false) {
        return this.prisma.category.findMany({
            where: { shopId, isArchived: includeArchived ? undefined : false },
            orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        });
    }
    async findCategoryByNameAndShop(shopId, name) {
        return this.prisma.category.findFirst({
            where: { shopId, name: { equals: name, mode: 'insensitive' } },
        });
    }
    async createCategory(data) {
        return this.prisma.category.create({ data });
    }
    async updateCategory(id, data) {
        return this.prisma.category.update({ where: { id }, data: data });
    }
    async deleteCategory(id) {
        await this.prisma.category.delete({ where: { id } });
    }
    async findMenuItemById(id) {
        return this.prisma.menuItem.findUnique({ where: { id } });
    }
    async findMenuItemsByShop(shopId, includeArchived = false) {
        return this.prisma.menuItem.findMany({
            where: { shopId, isArchived: includeArchived ? undefined : false },
            include: { category: { select: { name: true, isArchived: true } } },
            orderBy: [{ sortOrder: 'asc' }],
        });
    }
    async countMenuItemsByCategory(categoryId, includeArchived = false) {
        return this.prisma.menuItem.count({
            where: { categoryId, isArchived: includeArchived ? undefined : false },
        });
    }
    async createMenuItem(data) {
        return this.prisma.menuItem.create({ data: data });
    }
    async updateMenuItem(id, data) {
        return this.prisma.menuItem.update({ where: { id }, data: data });
    }
    async deleteMenuItem(id) {
        await this.prisma.menuItem.delete({ where: { id } });
    }
    async createGlobalCategory(data) {
        return this.prisma.globalCategory.create({ data });
    }
    async findGlobalCategories(includeInactive = false) {
        return this.prisma.globalCategory.findMany({
            where: { isActive: includeInactive ? undefined : true },
            orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }]
        });
    }
    async findGlobalCategoryById(id) {
        return this.prisma.globalCategory.findUnique({ where: { id } });
    }
    async updateGlobalCategory(id, data) {
        return this.prisma.globalCategory.update({ where: { id }, data });
    }
    async deleteGlobalCategory(id) {
        await this.prisma.globalCategory.delete({ where: { id } });
    }
    async createGlobalMenuItem(data) {
        return this.prisma.globalMenuItem.create({ data });
    }
    async findGlobalMenuItemsByCategory(categoryId, includeInactive = false) {
        return this.prisma.globalMenuItem.findMany({
            where: { categoryId, isActive: includeInactive ? undefined : true },
        });
    }
    async findGlobalMenuItemById(id) {
        return this.prisma.globalMenuItem.findUnique({ where: { id } });
    }
    async updateGlobalMenuItem(id, data) {
        return this.prisma.globalMenuItem.update({ where: { id }, data });
    }
    async deleteGlobalMenuItem(id) {
        await this.prisma.globalMenuItem.delete({ where: { id } });
    }
};
exports.MenuPrismaRepository = MenuPrismaRepository;
exports.MenuPrismaRepository = MenuPrismaRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MenuPrismaRepository);
//# sourceMappingURL=menu.prisma.repository.js.map