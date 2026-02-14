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
exports.ShopController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const vendor_auth_guard_1 = require("../../../shared/guards/vendor-auth.guard");
const current_user_decorator_1 = require("../../../shared/decorators/current-user.decorator");
const shop_service_1 = require("../application/shop.service");
let ShopController = class ShopController {
    constructor(shopService) {
        this.shopService = shopService;
    }
    async createShop(vendor, body) {
        return this.shopService.createShop(vendor.id, body);
    }
    async getMyShops(vendor) {
        return this.shopService.getMyShops(vendor);
    }
    async updateShop(shopId, vendor, body, files) {
        return this.shopService.updateShop(shopId, vendor, body, files);
    }
    async deleteShop(shopId, vendor) {
        return this.shopService.deleteShop(shopId, vendor);
    }
    async uploadUpiQrCode(shopId, vendor, file) {
        return this.shopService.uploadUpiQrCode(shopId, vendor, file);
    }
    async applyToFoodCourt(shopId, vendor, body) {
        return this.shopService.applyToFoodCourt(vendor.id, shopId, body.foodCourtId);
    }
};
exports.ShopController = ShopController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentVendor)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ShopController.prototype, "createShop", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentVendor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShopController.prototype, "getMyShops", null);
__decorate([
    (0, common_1.Put)(':shopId'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'logo', maxCount: 1 },
        { name: 'coverImage', maxCount: 1 },
        { name: 'upiQrCode', maxCount: 1 },
    ])),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, current_user_decorator_1.CurrentVendor)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ShopController.prototype, "updateShop", null);
__decorate([
    (0, common_1.Delete)(':shopId'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, current_user_decorator_1.CurrentVendor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ShopController.prototype, "deleteShop", null);
__decorate([
    (0, common_1.Put)(':shopId/upi-qr'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('qrImage')),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, current_user_decorator_1.CurrentVendor)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ShopController.prototype, "uploadUpiQrCode", null);
__decorate([
    (0, common_1.Post)(':shopId/apply-food-court'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, current_user_decorator_1.CurrentVendor)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ShopController.prototype, "applyToFoodCourt", null);
exports.ShopController = ShopController = __decorate([
    (0, common_1.Controller)('shops'),
    (0, common_1.UseGuards)(vendor_auth_guard_1.VendorAuthGuard),
    __metadata("design:paramtypes", [shop_service_1.ShopService])
], ShopController);
//# sourceMappingURL=shop.controller.js.map