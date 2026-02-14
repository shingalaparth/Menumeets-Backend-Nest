import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { AdminService } from '../application/admin.service';
import { UniversalAuthGuard } from '../../../shared/guards/universal-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';

@Controller('admin')
@UseGuards(UniversalAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
    constructor(private adminService: AdminService) { }

    // ── Dashboard ──
    @Get('analytics')
    async getStats() {
        return this.adminService.getDashboardStats();
    }

    // ── Shops ──
    @Get('shops')
    async getShops() {
        return this.adminService.getAllShops();
    }

    @Get('shops/:id')
    async getShopById(@Param('id') id: string) {
        return this.adminService.getShopById(id);
    }

    @Patch('shops/:id/toggle')
    async toggleShopStatus(@Param('id') id: string) {
        return this.adminService.updateShopStatus(id);
    }

    @Patch('shops/:id/commission')
    async updateCommission(@Param('id') id: string, @Body('commission') commission: number) {
        return this.adminService.updateShopCommission(id, commission);
    }

    @Delete('shops/:id')
    async deleteShop(@Param('id') id: string) {
        return this.adminService.deleteShop(id);
    }

    // ── Vendors ──
    @Get('vendors')
    async getVendors() {
        return this.adminService.getAllVendors();
    }

    @Get('vendors/:id')
    async getVendorById(@Param('id') id: string) {
        return this.adminService.getVendorById(id);
    }

    @Patch('vendors/:id/status')
    async updateVendorStatus(@Param('id') id: string) {
        return this.adminService.updateVendorStatus(id);
    }

    @Delete('vendors/:id')
    async deleteVendor(@Param('id') id: string) {
        return this.adminService.deleteVendor(id);
    }

    @Post('impersonate/:id')
    async impersonate(@Param('id') id: string) {
        return this.adminService.impersonateVendor(id);
    }

    @Patch('vendors/:id/reset-password')
    async resetPassword(@Param('id') id: string, @Body('password') password: string) {
        return this.adminService.resetVendorPassword(id, password);
    }

    // ── Orders ──
    @Get('orders')
    async getAllOrders(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('status') status?: string,
        @Query('shopId') shopId?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string
    ) {
        const filters: any = {};
        if (status) filters.status = status;
        if (shopId) filters.shopId = shopId;
        if (startDate) filters.startDate = startDate;
        if (endDate) filters.endDate = endDate;

        return this.adminService.getAllOrders(
            parseInt(page || '1'),
            parseInt(limit || '20'),
            filters
        );
    }

    @Get('orders/:id')
    async getOrderById(@Param('id') id: string) {
        return this.adminService.getOrderById(id);
    }

    @Patch('orders/:id/status')
    async updateOrderStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.adminService.updateOrderStatus(id, status);
    }

    // ── Users ──
    @Get('users')
    async getAllUsers(
        @Query('page') page?: string,
        @Query('limit') limit?: string
    ) {
        return this.adminService.getAllUsers(parseInt(page || '1'), parseInt(limit || '20'));
    }

    @Get('users/:id')
    async getUserById(@Param('id') id: string) {
        return this.adminService.getUserById(id);
    }

    // ── Reports ──
    @Get('reports/revenue')
    async getRevenueReport(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string
    ) {
        return this.adminService.getRevenueReport(startDate || '', endDate || '');
    }

    @Get('reports/top-items')
    async getTopSellingItems(
        @Query('limit') limit?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string
    ) {
        return this.adminService.getTopSellingItems(parseInt(limit || '10'), startDate, endDate);
    }

    // ── System Config ──
    @Get('config')
    async getSystemConfig() {
        return this.adminService.getSystemConfig();
    }

    @Patch('config')
    async updateSystemConfig(
        @Body('key') key: string,
        @Body('value') value: any,
        @Body('description') description?: string
    ) {
        return this.adminService.updateSystemConfig(key, value, description);
    }

    // ── Broadcasts ──
    @Post('messages')
    async sendBroadcast(
        @Body('title') title: string,
        @Body('message') message: string,
        @Body('recipientId') recipientId?: string
    ) {
        return this.adminService.sendBroadcast(title, message, recipientId);
    }

    @Get('messages/sent')
    async getBroadcasts() {
        return this.adminService.getBroadcasts();
    }

    // ── Settlements ──
    @Get('settlements')
    async getSettlements(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('shopId') shopId?: string,
        @Query('status') status?: string,
        @Query('period') period?: string
    ) {
        return this.adminService.getSettlements(
            parseInt(page || '1'),
            parseInt(limit || '20'),
            { shopId, status, period }
        );
    }

    @Post('settlements')
    async createSettlement(@Body() body: any) {
        return this.adminService.createSettlement(body);
    }

    @Post('settlements/:id/process')
    async processSettlement(
        @Req() req: any,
        @Param('id') id: string,
        @Body('reference') reference?: string
    ) {
        const adminId = req.user?.sub || req.user?.id || 'system';
        return this.adminService.processSettlement(adminId, id, reference);
    }

    // ── Audit Logs ──
    @Get('audit-logs')
    async getAuditLogs(
        @Query('actorId') actorId?: string,
        @Query('entityType') entityType?: string,
        @Query('entityId') entityId?: string,
        @Query('action') action?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string
    ) {
        return this.adminService.getAuditLogs({
            actorId, entityType, entityId, action,
            startDate, endDate,
            page: parseInt(page || '1'),
            limit: parseInt(limit || '50')
        });
    }
}
