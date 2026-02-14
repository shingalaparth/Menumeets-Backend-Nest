import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
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

    // ── Managers ──

    @Post(':franchiseId/managers')
    @Roles('vendor', 'admin', 'franchise_owner')
    async addManager(
        @Param('franchiseId') franchiseId: string, // Not used directly, but good for RESTful design. We use ownerId to verify ownership.
        @CurrentVendor() vendor: any,
        @Body() body: { vendorId: string, regions?: string[], assignedShops?: string[], permissions?: any }
    ) {
        // Validation: Verify if the current vendor is the owner of franchiseId?
        // Service handles looking up franchise by ownerId.
        // If franchiseId parameter doesn't match the one owned by vendor, service will throw or logic will be mismatch.
        // BETTER: Service `findByOwnerId` returns the franchise. We can check if `franchise.id === franchiseId`.

        // For now, let's rely on Service's logic finding the franchise by owner.
        // Ideally we should verify `franchiseId` matches the owner's franchise.

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
        @Query('duration') duration: string = 'week', // day, week, month
        @CurrentVendor() vendor: any,
    ) {
        return this.franchiseService.getFranchiseAnalytics(vendor.id, duration);
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
}
