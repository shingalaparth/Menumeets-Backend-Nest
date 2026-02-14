import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { GlobalMenuService } from '../application/global-menu.service';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { UniversalAuthGuard } from '../../../shared/guards/universal-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';

@Controller('admin/global-menu')
@UseGuards(UniversalAuthGuard, RolesGuard)
export class GlobalMenuController {
    constructor(private readonly service: GlobalMenuService) { }

    // ── Categories ──

    @Post('categories')
    @Roles('admin')
    @UseInterceptors(FileInterceptor('image'))
    createCategory(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
        return this.service.createGlobalCategory(body, file);
    }

    @Get('categories')
    // Accessible by shops too to see what to clone? Or just admins?
    // Let's allow vendors to see global categories (for cloning flow UI)
    @Roles('admin', 'vendor')
    getCategories(@CurrentUser() user: any) {
        const isAdmin = user.role === 'admin';
        return this.service.getGlobalCategories(isAdmin);
    }

    @Patch('categories/:id')
    @Roles('admin')
    updateCategory(@Param('id') id: string, @Body() body: any) {
        return this.service.updateGlobalCategory(id, body);
    }

    @Delete('categories/:id')
    @Roles('admin')
    deleteCategory(@Param('id') id: string) {
        return this.service.deleteGlobalCategory(id);
    }

    // ── Items ──

    @Post('items')
    @Roles('admin')
    @UseInterceptors(FileInterceptor('image'))
    createItem(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
        return this.service.createGlobalMenuItem(body, file);
    }

    @Get('categories/:categoryId/items')
    @Roles('admin', 'vendor')
    getItems(@Param('categoryId') categoryId: string, @CurrentUser() user: any) {
        const isAdmin = user.role === 'admin';
        return this.service.getGlobalItemsByCategory(categoryId, isAdmin);
    }

    @Patch('items/:id')
    @Roles('admin')
    updateItem(@Param('id') id: string, @Body() body: any) {
        return this.service.updateGlobalMenuItem(id, body);
    }

    @Delete('items/:id')
    @Roles('admin')
    deleteItem(@Param('id') id: string) {
        return this.service.deleteGlobalMenuItem(id);
    }

    // ── Clone ──

    @Post('clone-item')
    @Roles('vendor')
    cloneItem(
        @Body() body: { shopId: string, globalItemId: string, targetCategoryId: string },
        @CurrentUser() vendor: any
    ) {
        return this.service.cloneGlobalItemToShop(body.shopId, body.globalItemId, body.targetCategoryId, vendor);
    }
}
