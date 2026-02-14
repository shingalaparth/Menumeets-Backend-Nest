import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { InventoryService } from '../application/inventory.service';
import { UniversalAuthGuard } from '../../../shared/guards/universal-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';

@Controller('inventory')
@UseGuards(UniversalAuthGuard, RolesGuard)
export class InventoryController {
    constructor(private readonly service: InventoryService) { }

    @Get('ingredients/:shopId')
    @Roles('vendor', 'admin', 'franchise_owner')
    async getInventory(@Param('shopId') shopId: string) {
        return this.service.getInventory(shopId);
    }

    @Post('ingredients/:shopId')
    @Roles('vendor')
    async addIngredient(@Param('shopId') shopId: string, @Body() body: any) {
        return this.service.addIngredient(shopId, body);
    }

    @Post('stock/adjust/:shopId')
    @Roles('vendor')
    async adjustStock(@Param('shopId') shopId: string, @Request() req: any, @Body() body: any) {
        return this.service.adjustStock(
            shopId,
            body.ingredientId,
            body.quantity,
            body.changeType,
            body.reason,
            req.vendor.id,
            body.cost // Optional for PURCHASE
        );
    }

    @Post('recipes/:shopId')
    @Roles('vendor')
    async mapRecipe(@Param('shopId') shopId: string, @Body() body: any) {
        return this.service.mapRecipe(shopId, body.menuItemId, body.variantName, body.ingredients);
    }

    // --- New Endpoints for Full Parity ---

    @Post('ingredients/:shopId/:ingredientId') // Should strictly be PATCH/PUT, but legacy was PUT. Let's use Patch for Nest cleanliness or Put.
    // Legacy: PUT /ingredients/:ingredientId
    @Roles('vendor')
    async updateIngredient(@Param('shopId') shopId: string, @Param('ingredientId') ingredientId: string, @Body() body: any) {
        return this.service.updateIngredient(shopId, ingredientId, body);
    }

    @Get('recipe/:shopId/:menuItemId')
    @Roles('vendor', 'admin')
    async getRecipe(@Param('shopId') shopId: string, @Param('menuItemId') menuItemId: string) {
        return this.service.getRecipe(shopId, menuItemId);
    }

    @Get('history/:shopId')
    @Roles('vendor', 'admin')
    async getHistory(@Param('shopId') shopId: string) {
        return this.service.getStockHistory(shopId);
    }

    @Get('suppliers/:shopId')
    @Roles('vendor', 'admin')
    async getSuppliers(@Param('shopId') shopId: string) {
        return this.service.getSuppliers(shopId);
    }

    @Post('suppliers/:shopId')
    @Roles('vendor')
    async addSupplier(@Param('shopId') shopId: string, @Body() body: any) {
        return this.service.addSupplier(shopId, body);
    }

    @Get('purchase-orders/:shopId')
    @Roles('vendor', 'admin')
    async getPurchaseOrders(@Param('shopId') shopId: string) {
        return this.service.getPurchaseOrders(shopId);
    }

    @Post('purchase-orders/:shopId')
    @Roles('vendor')
    async createPurchaseOrder(@Param('shopId') shopId: string, @Body() body: any) {
        return this.service.createPurchaseOrder(shopId, body);
    }

    @Post('purchase-orders/:shopId/:poId/status') // Using POST for status update or PATCH is fine. Legacy used PATCH.
    @Roles('vendor')
    async updatePOStatus(@Param('shopId') shopId: string, @Param('poId') poId: string, @Request() req: any, @Body() body: any) {
        return this.service.updatePOStatus(shopId, poId, body.status, req.vendor.id);
    }
}
