import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AdminService } from '../application/admin.service';
import { UniversalAuthGuard } from '../../../shared/guards/universal-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';

@Controller('admin')
@UseGuards(UniversalAuthGuard, RolesGuard)
@Roles('admin') // Enforce admin role for all
export class AdminController {
    constructor(private readonly service: AdminService) { }

    @Get('analytics')
    async getStats() {
        return this.service.getDashboardStats();
    }

    // Shops
    @Get('shops')
    async getShops() {
        return this.service.getAllShops();
    }

    @Patch('shops/:id/toggle-status')
    async toggleShopStatus(@Param('id') id: string) {
        return this.service.updateShopStatus(id);
    }

    @Patch('shops/:id/commission')
    async updateCommission(@Param('id') id: string, @Body('platformCommission') commission: number) {
        return this.service.updateShopCommission(id, commission);
    }

    // Vendors
    @Get('vendors')
    async getVendors() {
        return this.service.getAllVendors();
    }

    @Post('impersonate/:id')
    async impersonate(@Param('id') id: string) {
        return this.service.impersonateVendor(id);
    }

    @Patch('vendors/:id/reset-password')
    async resetPassword(@Param('id') id: string, @Body('password') pass: string) {
        return this.service.resetVendorPassword(id, pass);
    }

    // Broadcasts
    @Post('messages')
    async sendBroadcast(@Body() body: any) {
        return this.service.sendBroadcast(body.title, body.message, body.recipientId);
    }

    @Get('messages/sent')
    async getBroadcasts() {
        return this.service.getBroadcasts();
    }
}
