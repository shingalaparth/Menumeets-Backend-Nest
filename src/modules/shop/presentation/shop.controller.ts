/**
 * Shop Controller — Presentation layer
 * Maps HTTP routes to ShopService methods.
 * Migrated from shop.routes.js + shop.controller.js
 *
 * Cross-module routes (messages, food-court apply) will be added
 * when those modules are migrated — they'll live in their own controllers.
 */
import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { VendorAuthGuard } from '../../../shared/guards/vendor-auth.guard';
import { CurrentVendor } from '../../../shared/decorators/current-user.decorator';
import { ShopService } from '../application/shop.service';

@Controller('shops')
@UseGuards(VendorAuthGuard)
export class ShopController {
    constructor(private shopService: ShopService) { }

    /** POST /shops — Create a new shop */
    @Post()
    async createShop(
        @CurrentVendor() vendor: any,
        @Body() body: { name: string; address?: string; phone?: string; businessType?: string },
    ) {
        return this.shopService.createShop(vendor.id, body);
    }

    /** GET /shops — Get all shops for this vendor */
    @Get()
    async getMyShops(@CurrentVendor() vendor: any) {
        return this.shopService.getMyShops(vendor);
    }

    /** PUT /shops/:shopId — Update shop settings + upload logo/cover/UPI QR */
    @Put(':shopId')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'logo', maxCount: 1 },
            { name: 'coverImage', maxCount: 1 },
            { name: 'upiQrCode', maxCount: 1 },
        ]),
    )
    async updateShop(
        @Param('shopId') shopId: string,
        @CurrentVendor() vendor: any,
        @Body() body: any,
        @UploadedFiles() files: Record<string, Express.Multer.File[]>,
    ) {
        return this.shopService.updateShop(shopId, vendor, body, files);
    }

    /** DELETE /shops/:shopId — Delete a shop */
    @Delete(':shopId')
    async deleteShop(
        @Param('shopId') shopId: string,
        @CurrentVendor() vendor: any,
    ) {
        return this.shopService.deleteShop(shopId, vendor);
    }

    @Put(':shopId/upi-qr')
    @UseInterceptors(FileInterceptor('qrImage'))
    async uploadUpiQrCode(
        @Param('shopId') shopId: string,
        @CurrentVendor() vendor: any,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.shopService.uploadUpiQrCode(shopId, vendor, file);
    }

    // ── Interactions (Phase 11) ──

    @Post(':shopId/apply-food-court')
    async applyToFoodCourt(
        @Param('shopId') shopId: string,
        @CurrentVendor() vendor: any,
        @Body() body: { foodCourtId: string }
    ) {
        // This should ideally call FoodCourtService.requestToJoin via a shared module or event.
        // For now, we stub it or assume ShopService handles it -> but ShopService shouldn't depend on FoodCourtService to avoid circular dep.
        // Best approach: ShopService triggers an event, or we just return a success message for the mock.
        // Or, we can duplicate the simple logic or use a generic "Request" service.

        // Let's implement a method in ShopService that effectively "sends a request".
        return this.shopService.applyToFoodCourt(vendor.id, shopId, body.foodCourtId);
    }
}
