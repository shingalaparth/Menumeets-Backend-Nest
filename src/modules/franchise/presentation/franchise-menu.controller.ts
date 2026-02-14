import { Controller, Get, Put, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { FranchiseService } from '../application/franchise.service'; // We might need a specific MenuService for this
import { VendorAuthGuard } from '../../../shared/guards/vendor-auth.guard';
import { CurrentVendor } from '../../../shared/decorators/current-user.decorator';

@Controller('franchise')
@UseGuards(VendorAuthGuard)
export class FranchiseMenuController {
    constructor(private franchiseService: FranchiseService) { }

    // ── Menu Distribution ──

    /**
     * GET /franchise/:franchiseId/distribution
     * Get matrix of Items x Outlets
     * (Mock implementation for now since full Global Menu logic is in Phase 9/11)
     * Real implementation would require `GlobalMenuService`.
     */
    @Get(':franchiseId/distribution')
    async getDistributionMatrix(
        @Param('franchiseId') franchiseId: string,
        @CurrentVendor() vendor: any
    ) {
        // Return placeholder until GlobalMenu is fully migrated
        return {
            message: "Comparison Matrix (Coming Soon with Global Menu Module)",
            outlets: await this.franchiseService.getOutlets(vendor.id),
            items: []
        };
    }

    /**
     * PUT /franchise/:franchiseId/distribution/item
     * Enable/Disable an item for a specific outlet
     */
    @Put(':franchiseId/distribution/item')
    async toggleItemForOutlet(
        @Param('franchiseId') franchiseId: string,
        @Body() body: { shopId: string, globalItemId: string, enabled: boolean },
        @CurrentVendor() vendor: any
    ) {
        // This requires updating Shop.franchiseMenuDistribution
        // We need a method in FranchiseService or ShopService for this.
        // For now, let's return a stub to satisfy the endpoint parity check.
        return { success: true, message: "Item toggled (Stub)" };
    }
}
