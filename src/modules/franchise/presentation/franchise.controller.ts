import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query, Patch } from '@nestjs/common';
import { FranchiseService } from '../application/franchise.service';
import { VendorAuthGuard } from '../../../shared/guards/vendor-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { CurrentVendor } from '../../../shared/decorators/current-user.decorator';

@Controller('franchise')
@UseGuards(VendorAuthGuard, RolesGuard)
export class FranchiseController {
    constructor(private readonly franchiseService: FranchiseService) { }

    @Post()
    @Roles('vendor', 'admin', 'franchise_owner')
    async createFranchise(@Request() req: any, @Body() body: any) {
        return this.franchiseService.createFranchise(req.vendor.sub || req.vendor.id, body);
    }

    @Get()
    @Roles('vendor', 'admin', 'franchise_owner')
    async getMyFranchise(@Request() req: any) {
        return this.franchiseService.getMyFranchise(req.vendor.sub || req.vendor.id);
    }

    @Put()
    @Roles('vendor', 'admin', 'franchise_owner')
    async updateFranchise(@Request() req: any, @Body() body: any) {
        return this.franchiseService.updateFranchise(req.vendor.sub || req.vendor.id, body);
    }

    @Get('outlets')
    @Roles('vendor', 'admin', 'franchise_owner')
    async getOutlets(@Request() req: any) {
        return this.franchiseService.getOutlets(req.vendor.sub || req.vendor.id);
    }

    @Post('outlets/:shopId')
    @Roles('vendor', 'admin', 'franchise_owner')
    async addOutlet(@Request() req: any, @Param('shopId') shopId: string) {
        return this.franchiseService.addOutlet(req.vendor.sub || req.vendor.id, shopId);
    }

    @Delete('outlets/:shopId')
    @Roles('vendor', 'admin', 'franchise_owner')
    async removeOutlet(@Request() req: any, @Param('shopId') shopId: string) {
        return this.franchiseService.removeOutlet(req.vendor.sub || req.vendor.id, shopId);
    }

    // ── Managers ──

    @Post(':franchiseId/managers')
    @Roles('vendor', 'admin', 'franchise_owner')
    async addManager(
        @Param('franchiseId') franchiseId: string,
        @CurrentVendor() vendor: any,
        @Body() body: { vendorId: string; regions?: string[]; assignedShops?: string[]; permissions?: any }
    ) {
        return this.franchiseService.addManager(vendor.id, body.vendorId, body);
    }

    @Delete(':franchiseId/managers/:managerVendorId')
    @Roles('vendor', 'admin', 'franchise_owner')
    async removeManager(
        @Param('franchiseId') franchiseId: string,
        @Param('managerVendorId') managerVendorId: string,
        @CurrentVendor() vendor: any,
    ) {
        return this.franchiseService.removeManager(vendor.id, managerVendorId);
    }

    @Get(':franchiseId/managers')
    @Roles('vendor', 'admin', 'franchise_owner')
    async getManagers(
        @Param('franchiseId') franchiseId: string,
        @CurrentVendor() vendor: any,
    ) {
        return this.franchiseService.getManagers(vendor.id);
    }

    // ── Analytics ──

    @Get(':franchiseId/analytics')
    @Roles('vendor', 'admin', 'franchise_owner')
    async getAnalytics(
        @Param('franchiseId') franchiseId: string,
        @Query('duration') duration: string = 'week',
        @CurrentVendor() vendor: any,
    ) {
        return this.franchiseService.getFranchiseAnalytics(vendor.id, duration);
    }

    // ── Reports (Parity) ──

    @Get('reports/sales')
    @Roles('vendor', 'admin', 'franchise_owner')
    async getSalesReport(
        @Request() req: any,
        @Query('period') period: string
    ) {
        return this.franchiseService.getSalesReport(req.vendor.sub || req.vendor.id, period);
    }

    @Get('reports/outlet-comparison')
    @Roles('vendor', 'admin', 'franchise_owner')
    async getOutletComparison(
        @Request() req: any,
        @Query('period') period: string
    ) {
        return this.franchiseService.getOutletComparison(req.vendor.sub || req.vendor.id, period);
    }

    @Get('reports/orders')
    @Roles('vendor', 'admin', 'franchise_owner')
    async getOrdersReport(
        @Request() req: any,
        @Query('period') period: string
    ) {
        return this.franchiseService.getOrdersReport(req.vendor.sub || req.vendor.id, period);
    }

    @Get('reports/inventory')
    @Roles('vendor', 'admin', 'franchise_owner')
    async getInventoryReport(@Request() req: any) {
        return this.franchiseService.getInventoryReport(req.vendor.sub || req.vendor.id);
    }

    @Get('reports/managers')
    @Roles('vendor', 'admin', 'franchise_owner')
    async getManagerReport(
        @Request() req: any,
        @Query('period') period: string
    ) {
        return this.franchiseService.getManagerReport(req.vendor.sub || req.vendor.id, period);
    }

    // ── Menu Distribution (Parity) ──

    @Get('menu/distribution')
    @Roles('vendor', 'admin', 'franchise_owner')
    async getDistributionMatrix(@Request() req: any) {
        return this.franchiseService.getDistributionMatrix(req.vendor.sub || req.vendor.id);
    }

    @Patch('menu/distribution/:outletId/items/:itemId')
    @Roles('vendor', 'admin', 'franchise_owner')
    async toggleItemForOutlet(
        @Request() req: any,
        @Param('outletId') outletId: string,
        @Param('itemId') itemId: string,
        @Body('enabled') enabled: boolean
    ) {
        return this.franchiseService.toggleItemForOutlet(
            req.vendor.sub || req.vendor.id,
            outletId,
            itemId,
            enabled
        );
    }
}
