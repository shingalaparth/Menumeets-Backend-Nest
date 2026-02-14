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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const admin_repository_1 = require("../domain/admin.repository");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
let AdminService = class AdminService {
    constructor(repo, jwtService) {
        this.repo = repo;
        this.jwtService = jwtService;
    }
    async getDashboardStats() {
        return this.repo.getGlobalStats();
    }
    async getAllShops() {
        const shops = await this.repo.getAllShops(0, 100);
        return { count: shops.length, data: shops };
    }
    async updateShopStatus(shopId) {
        const shop = await this.repo.findShopById(shopId);
        if (!shop)
            throw new common_1.NotFoundException('Shop not found');
        return this.repo.updateShop(shopId, { isActive: !shop.isActive });
    }
    async updateShopCommission(shopId, commission) {
        const shop = await this.repo.findShopById(shopId);
        if (!shop)
            throw new common_1.NotFoundException('Shop not found');
        const settings = shop.settings || {};
        const profile = settings.profile || {};
        profile.platformCommission = commission;
        settings.profile = profile;
        return this.repo.updateShop(shopId, { settings });
    }
    async getAllVendors() {
        const vendors = await this.repo.getAllVendors(0, 100);
        return { count: vendors.length, data: vendors };
    }
    async impersonateVendor(vendorId) {
        const vendor = await this.repo.findVendorById(vendorId);
        if (!vendor)
            throw new common_1.NotFoundException('Vendor not found');
        const payload = { sub: vendor.id, role: vendor.role };
        const token = this.jwtService.sign(payload);
        return {
            message: `Impersonating ${vendor.name}`,
            token,
            vendor: {
                id: vendor.id,
                name: vendor.name,
                role: vendor.role
            }
        };
    }
    async resetVendorPassword(vendorId, newPass) {
        const vendor = await this.repo.findVendorById(vendorId);
        if (!vendor)
            throw new common_1.NotFoundException('Vendor not found');
        const hashedPassword = await bcrypt.hash(newPass, 10);
        await this.repo.updateVendor(vendorId, { password: hashedPassword });
        return { message: 'Password reset successfully' };
    }
    async sendBroadcast(title, message, recipientId) {
        return this.repo.createBroadcast({
            title,
            message,
            recipientId: recipientId || null
        });
    }
    async getBroadcasts() {
        return this.repo.getBroadcasts();
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(admin_repository_1.ADMIN_REPOSITORY)),
    __metadata("design:paramtypes", [Object, jwt_1.JwtService])
], AdminService);
//# sourceMappingURL=admin.service.js.map