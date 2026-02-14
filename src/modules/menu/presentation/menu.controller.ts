/**
 * Menu Controller — Presentation layer
 * Covers Category CRUD + MenuItem CRUD routes.
 * Migrated from category.routes.js + menu.routes.js
 */
import {
    Controller,
    Get,
    Post,
    Put,
    Patch,
    Delete,
    Param,
    Body,
    Query,
    UseGuards,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VendorAuthGuard } from '../../../shared/guards/vendor-auth.guard';
import { CurrentVendor } from '../../../shared/decorators/current-user.decorator';
import { MenuService } from '../application/menu.service';

@Controller('shops/:shopId')
@UseGuards(VendorAuthGuard)
export class MenuController {
    constructor(private menuService: MenuService) { }

    // ── Categories ──

    @Post('categories')
    createCategory(@Param('shopId') shopId: string, @CurrentVendor() vendor: any, @Body() body: any) {
        return this.menuService.createCategory(shopId, vendor, body);
    }

    @Get('categories')
    getShopCategories(@Param('shopId') shopId: string, @CurrentVendor() vendor: any, @Query('status') status?: string) {
        return this.menuService.getShopCategories(shopId, vendor, status);
    }

    @Put('categories/:categoryId')
    updateCategory(@Param('shopId') shopId: string, @Param('categoryId') catId: string, @CurrentVendor() vendor: any, @Body() body: any) {
        return this.menuService.updateCategory(shopId, catId, vendor, body);
    }

    @Delete('categories/:categoryId')
    deleteCategory(@Param('shopId') shopId: string, @Param('categoryId') catId: string, @CurrentVendor() vendor: any) {
        return this.menuService.deleteCategory(shopId, catId, vendor);
    }

    @Patch('categories/:categoryId/restore')
    restoreCategory(@Param('shopId') shopId: string, @Param('categoryId') catId: string, @CurrentVendor() vendor: any) {
        return this.menuService.restoreCategory(shopId, catId, vendor);
    }

    @Delete('categories/:categoryId/permanent')
    permanentDeleteCategory(@Param('shopId') shopId: string, @Param('categoryId') catId: string, @CurrentVendor() vendor: any) {
        return this.menuService.permanentDeleteCategory(shopId, catId, vendor);
    }

    // ── Menu Items ──

    @Post('menu')
    @UseInterceptors(FileInterceptor('image'))
    createMenuItem(@Param('shopId') shopId: string, @CurrentVendor() vendor: any, @Body() body: any, @UploadedFile() file: Express.Multer.File) {
        return this.menuService.createMenuItem(shopId, vendor, body, file);
    }

    @Get('menu')
    getShopMenuItems(@Param('shopId') shopId: string, @CurrentVendor() vendor: any, @Query('archived') archived?: string) {
        return this.menuService.getShopMenuItems(shopId, vendor, archived);
    }

    @Put('menu/:itemId')
    @UseInterceptors(FileInterceptor('image'))
    updateMenuItem(@Param('shopId') shopId: string, @Param('itemId') itemId: string, @CurrentVendor() vendor: any, @Body() body: any, @UploadedFile() file: Express.Multer.File) {
        return this.menuService.updateMenuItem(shopId, itemId, vendor, body, file);
    }

    @Delete('menu/:itemId')
    deleteMenuItem(@Param('shopId') shopId: string, @Param('itemId') itemId: string, @CurrentVendor() vendor: any) {
        return this.menuService.deleteMenuItem(shopId, itemId, vendor);
    }

    @Patch('menu/:itemId/restore')
    restoreMenuItem(@Param('shopId') shopId: string, @Param('itemId') itemId: string, @CurrentVendor() vendor: any) {
        return this.menuService.restoreMenuItem(shopId, itemId, vendor);
    }

    @Delete('menu/:itemId/permanent')
    permanentDeleteMenuItem(@Param('shopId') shopId: string, @Param('itemId') itemId: string, @CurrentVendor() vendor: any) {
        return this.menuService.permanentDeleteMenuItem(shopId, itemId, vendor);
    }

    @Patch('menu/:itemId/favorite')
    toggleFavorite(@Param('shopId') shopId: string, @Param('itemId') itemId: string, @CurrentVendor() vendor: any) {
        return this.menuService.toggleFavorite(shopId, itemId, vendor);
    }
}
