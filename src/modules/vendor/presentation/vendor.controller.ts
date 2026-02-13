/**
 * Vendor Controller — migrated from old vendor.controller.js + vendor.routes.js
 *
 * Old routes (all under /api/vendor, protected by protect()):
 *   GET    /profile         → getProfile
 *   PUT    /profile         → updateVendor (with avatar upload)
 *   DELETE /profile         → deleteVendor
 *   POST   /logout          → logoutVendor
 *   PUT    /change-password → changeVendorPassword
 *   PUT    /kyc             → updateKYC (multi-file upload)
 *   PUT    /bank-details    → updateBankDetails (multi-file upload)
 *   GET    /activity-logs   → getActivityLogs
 *   GET    /all             → admin only (list all vendors)
 */
import {
    Controller, Get, Put, Post, Delete,
    Body, UseGuards, Req, UseInterceptors, UploadedFile, UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { VendorService } from '../application/vendor.service';
import { VendorAuthGuard } from '../../../shared/guards/vendor-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { CurrentVendor } from '../../../shared/decorators/current-user.decorator';

@Controller('vendor')
@UseGuards(VendorAuthGuard)
export class VendorController {
    constructor(private vendorService: VendorService) { }

    // ── Profile ──

    @Get('profile')
    async getProfile(@CurrentVendor() vendor: any) {
        return this.vendorService.getProfile(vendor.id);
    }

    @Put('profile')
    @UseInterceptors(FileInterceptor('avatar'))
    async updateProfile(
        @CurrentVendor() vendor: any,
        @Body() body: any,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        return this.vendorService.updateProfile(vendor.id, body, file);
    }

    @Delete('profile')
    async deleteProfile(@CurrentVendor() vendor: any) {
        return this.vendorService.deleteVendor(vendor.id);
    }

    // ── Auth ──

    @Post('logout')
    async logout(@CurrentVendor() vendor: any, @Req() req: any) {
        await this.vendorService.logActivity(vendor.id, 'LOGOUT', 'User logged out', req.ip, req.headers['user-agent']);
        return { message: 'Logged out successfully' };
    }

    @Put('change-password')
    async changePassword(
        @CurrentVendor() vendor: any,
        @Body() body: { currentPassword: string; newPassword: string },
    ) {
        return this.vendorService.changePassword(vendor.id, body.currentPassword, body.newPassword);
    }

    // ── KYC ──

    @Put('kyc')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'aadhaarFrontImage', maxCount: 1 },
        { name: 'aadhaarBackImage', maxCount: 1 },
        { name: 'panImage', maxCount: 1 },
        { name: 'signatureImage', maxCount: 1 },
    ]))
    async updateKYC(
        @CurrentVendor() vendor: any,
        @Body() body: any,
        @UploadedFiles() files: Record<string, Express.Multer.File[]>,
    ) {
        return this.vendorService.updateKYC(vendor.id, body, files);
    }

    // ── Bank Details ──

    @Put('bank-details')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'cancelledChequeImage', maxCount: 1 },
        { name: 'passbookImage', maxCount: 1 },
    ]))
    async updateBankDetails(
        @CurrentVendor() vendor: any,
        @Body() body: any,
        @UploadedFiles() files: Record<string, Express.Multer.File[]>,
    ) {
        return this.vendorService.updateBankDetails(vendor.id, body, files);
    }

    // ── Activity Logs ──

    @Get('activity-logs')
    async getActivityLogs(@CurrentVendor() vendor: any) {
        return this.vendorService.getActivityLogs(vendor.id);
    }

    // ── Admin ──

    @Get('all')
    @UseGuards(RolesGuard)
    @Roles('admin')
    async getAllVendors() {
        return this.vendorService.findAll();
    }
}
