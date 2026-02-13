"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const vendor_service_1 = require("../application/vendor.service");
const vendor_auth_guard_1 = require("../../../shared/guards/vendor-auth.guard");
const roles_guard_1 = require("../../../shared/guards/roles.guard");
const roles_decorator_1 = require("../../../shared/decorators/roles.decorator");
const current_user_decorator_1 = require("../../../shared/decorators/current-user.decorator");
let VendorController = class VendorController {
    constructor(vendorService) {
        this.vendorService = vendorService;
    }
    async getProfile(vendor) {
        return this.vendorService.getProfile(vendor.id);
    }
    async updateProfile(vendor, body, file) {
        return this.vendorService.updateProfile(vendor.id, body, file);
    }
    async deleteProfile(vendor) {
        return this.vendorService.deleteVendor(vendor.id);
    }
    async logout(vendor, req) {
        await this.vendorService.logActivity(vendor.id, 'LOGOUT', 'User logged out', req.ip, req.headers['user-agent']);
        return { message: 'Logged out successfully' };
    }
    async changePassword(vendor, body) {
        return this.vendorService.changePassword(vendor.id, body.currentPassword, body.newPassword);
    }
    async updateKYC(vendor, body, files) {
        return this.vendorService.updateKYC(vendor.id, body, files);
    }
    async updateBankDetails(vendor, body, files) {
        return this.vendorService.updateBankDetails(vendor.id, body, files);
    }
    async getActivityLogs(vendor) {
        return this.vendorService.getActivityLogs(vendor.id);
    }
    async getAllVendors() {
        return this.vendorService.findAll();
    }
};
exports.VendorController = VendorController;
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, current_user_decorator_1.CurrentVendor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)('profile'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('avatar')),
    __param(0, (0, current_user_decorator_1.CurrentVendor)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Delete)('profile'),
    __param(0, (0, current_user_decorator_1.CurrentVendor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "deleteProfile", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, current_user_decorator_1.CurrentVendor)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "logout", null);
__decorate([
    (0, common_1.Put)('change-password'),
    __param(0, (0, current_user_decorator_1.CurrentVendor)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Put)('kyc'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'aadhaarFrontImage', maxCount: 1 },
        { name: 'aadhaarBackImage', maxCount: 1 },
        { name: 'panImage', maxCount: 1 },
        { name: 'signatureImage', maxCount: 1 },
    ])),
    __param(0, (0, current_user_decorator_1.CurrentVendor)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "updateKYC", null);
__decorate([
    (0, common_1.Put)('bank-details'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'cancelledChequeImage', maxCount: 1 },
        { name: 'passbookImage', maxCount: 1 },
    ])),
    __param(0, (0, current_user_decorator_1.CurrentVendor)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "updateBankDetails", null);
__decorate([
    (0, common_1.Get)('activity-logs'),
    __param(0, (0, current_user_decorator_1.CurrentVendor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "getActivityLogs", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "getAllVendors", null);
exports.VendorController = VendorController = __decorate([
    (0, common_1.Controller)('vendor'),
    (0, common_1.UseGuards)(vendor_auth_guard_1.VendorAuthGuard),
    __metadata("design:paramtypes", [vendor_service_1.VendorService])
], VendorController);
//# sourceMappingURL=vendor.controller.js.map