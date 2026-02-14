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
exports.ShopService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_service_1 = require("../../../infrastructure/external/cloudinary.service");
const shop_repository_1 = require("../domain/shop.repository");
const shop_request_repository_1 = require("../domain/shop-request.repository");
const parseJSON = (value) => {
    try {
        return typeof value === 'string' ? JSON.parse(value) : value;
    }
    catch {
        return null;
    }
};
let ShopService = class ShopService {
    constructor(shopRepo, requestRepo, cloudinary) {
        this.shopRepo = shopRepo;
        this.requestRepo = requestRepo;
        this.cloudinary = cloudinary;
    }
    async checkOwnership(shopId, vendor) {
        const shop = await this.shopRepo.findById(shopId);
        if (!shop)
            throw new common_1.NotFoundException('Shop not found');
        const isOwner = shop.ownerId === vendor.id;
        const isStaff = vendor.managesShop === shop.id;
        if (!isOwner && !isStaff) {
            throw new common_1.ForbiddenException('You do not have access to this shop');
        }
        return shop;
    }
    async createShop(vendorId, data) {
        if (!data.name?.trim()) {
            throw new common_1.BadRequestException('Shop name is required');
        }
        return this.shopRepo.create({
            name: data.name.trim(),
            address: data.address?.trim() || '',
            phone: data.phone?.trim() || '',
            businessType: data.businessType || 'Restaurant',
            ownerId: vendorId,
        });
    }
    async getMyShops(vendor) {
        if (vendor.managesShop) {
            return this.shopRepo.findByIds([vendor.managesShop]);
        }
        return this.shopRepo.findByOwnerId(vendor.id);
    }
    async deleteShop(shopId, vendor) {
        const shop = await this.checkOwnership(shopId, vendor);
        const settings = shop.settings;
        if (settings?.profile?.logo?.publicId) {
            await this.cloudinary.deleteImage(settings.profile.logo.publicId);
        }
        if (settings?.profile?.coverImage?.publicId) {
            await this.cloudinary.deleteImage(settings.profile.coverImage.publicId);
        }
        if (shop.upiQrCodeUrl) {
            try {
                const parts = shop.upiQrCodeUrl.split('/');
                const publicId = parts[parts.length - 1].split('.')[0];
                await this.cloudinary.deleteImage(`menumeets/qr-codes/${publicId}`);
            }
            catch (e) {
                console.error('QR delete error:', e);
            }
        }
        await this.shopRepo.delete(shopId);
        return { message: 'Shop deleted successfully' };
    }
    async updateShop(shopId, vendor, updates, files) {
        const shop = await this.checkOwnership(shopId, vendor);
        const data = {};
        if (updates.name?.trim())
            data.name = updates.name.trim();
        if (updates.address?.trim())
            data.address = updates.address.trim();
        if (updates.phone?.trim())
            data.phone = updates.phone.trim();
        if (updates.captainPin?.trim())
            data.captainPin = updates.captainPin.trim();
        if (updates.kotPin?.trim())
            data.kotPin = updates.kotPin.trim();
        const currentSettings = shop.settings || {};
        if (!currentSettings.profile)
            currentSettings.profile = {};
        const profile = currentSettings.profile;
        if (updates.displayEmail !== undefined)
            profile.displayEmail = updates.displayEmail;
        if (updates.displayPhone !== undefined)
            profile.displayPhone = updates.displayPhone;
        if (updates.fssai !== undefined)
            profile.fssai = updates.fssai;
        if (updates.gstin !== undefined)
            profile.gstin = updates.gstin;
        if (updates.openingTime !== undefined)
            profile.openingTime = updates.openingTime;
        if (updates.closingTime !== undefined)
            profile.closingTime = updates.closingTime;
        if (updates.isTemporarilyClosed !== undefined) {
            profile.isTemporarilyClosed = updates.isTemporarilyClosed === 'true' || updates.isTemporarilyClosed === true;
        }
        if (updates.autoReopenDate !== undefined) {
            profile.autoReopenDate = updates.autoReopenDate;
        }
        if (updates.offDays) {
            const parsed = parseJSON(updates.offDays);
            if (parsed)
                profile.offDays = parsed;
        }
        if (updates.serviceModes) {
            const parsed = parseJSON(updates.serviceModes);
            if (parsed) {
                if (!profile.serviceModes)
                    profile.serviceModes = {};
                profile.serviceModes = { ...profile.serviceModes, ...parsed };
            }
        }
        if (updates.tax) {
            const parsed = parseJSON(updates.tax);
            if (parsed) {
                if (!currentSettings.tax)
                    currentSettings.tax = {};
                currentSettings.tax = { ...currentSettings.tax, ...parsed };
            }
        }
        if (updates.featureAccess) {
            let parsed = parseJSON(updates.featureAccess);
            if (!parsed && updates.settings?.featureAccess) {
                parsed = updates.settings.featureAccess;
            }
            if (parsed) {
                if (!currentSettings.featureAccess)
                    currentSettings.featureAccess = {};
                const entitlements = currentSettings.featureEntitlements || {};
                Object.keys(parsed).forEach(key => {
                    if (parsed[key] === true && entitlements[key] === false) {
                        parsed[key] = false;
                    }
                });
                currentSettings.featureAccess = { ...currentSettings.featureAccess, ...parsed };
            }
        }
        if (updates.soundPreferences) {
            const parsed = parseJSON(updates.soundPreferences);
            if (parsed) {
                data.soundPreferences = { ...(shop.soundPreferences || {}), ...parsed };
            }
        }
        if (updates.quickAccess !== undefined) {
            const parsed = parseJSON(updates.quickAccess);
            if (Array.isArray(parsed)) {
                currentSettings.quickAccess = parsed.slice(0, 8);
            }
        }
        if (updates.orientationMode !== undefined) {
            const validModes = ['auto', 'portrait', 'landscape'];
            if (validModes.includes(updates.orientationMode)) {
                currentSettings.orientationMode = updates.orientationMode;
            }
        }
        data.settings = currentSettings;
        if (files) {
            if (files.logo?.[0]) {
                if (profile.logo?.publicId) {
                    await this.cloudinary.deleteImage(profile.logo.publicId);
                }
                const result = await this.cloudinary.uploadImage(files.logo[0].buffer, 'shop-logos');
                profile.logo = { url: result.secure_url, publicId: result.public_id };
                data.settings = currentSettings;
            }
            if (files.coverImage?.[0]) {
                if (profile.coverImage?.publicId) {
                    await this.cloudinary.deleteImage(profile.coverImage.publicId);
                }
                const result = await this.cloudinary.uploadImage(files.coverImage[0].buffer, 'shop-covers');
                profile.coverImage = { url: result.secure_url, publicId: result.public_id };
                data.settings = currentSettings;
            }
            if (files.upiQrCode?.[0]) {
                if (shop.upiQrCodeUrl) {
                    try {
                        const parts = shop.upiQrCodeUrl.split('/');
                        const publicId = parts[parts.length - 1].split('.')[0];
                        await this.cloudinary.deleteImage(`menumeets/qr-codes/${publicId}`);
                    }
                    catch (e) {
                        console.error('QR delete error:', e);
                    }
                }
                const result = await this.cloudinary.uploadImage(files.upiQrCode[0].buffer, 'menumeets/qr-codes');
                data.upiQrCodeUrl = result.secure_url;
            }
        }
        return this.shopRepo.update(shopId, data);
    }
    async uploadUpiQrCode(shopId, vendor, file) {
        const shop = await this.checkOwnership(shopId, vendor);
        if (!file)
            throw new common_1.BadRequestException('Please upload a QR code image.');
        if (shop.upiQrCodeUrl) {
            try {
                const parts = shop.upiQrCodeUrl.split('/');
                const publicId = parts[parts.length - 1].split('.')[0];
                await this.cloudinary.deleteImage(`menumeets/qr-codes/${publicId}`);
            }
            catch (e) {
                console.error('QR delete error:', e);
            }
        }
        const result = await this.cloudinary.uploadImage(file.buffer, 'menumeets/qr-codes');
        await this.shopRepo.update(shopId, { upiQrCodeUrl: result.secure_url });
        return { upiQrCodeUrl: result.secure_url };
    }
    async findById(id) {
        return this.shopRepo.findById(id);
    }
    async getShopById(id) {
        return this.findById(id);
    }
    async applyToFoodCourt(vendorId, shopId, foodCourtId) {
        const shop = await this.checkOwnership(shopId, { id: vendorId });
        const request = await this.requestRepo.create({
            shopId,
            foodCourtId,
            type: 'JOIN_FOOD_COURT',
            status: 'PENDING',
            message: `Shop ${shop.name} requested to join Food Court`
        });
        return {
            message: `Application sent to Food Court ${foodCourtId}`,
            status: 'Pending',
            requestId: request.id
        };
    }
};
exports.ShopService = ShopService;
exports.ShopService = ShopService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(shop_repository_1.SHOP_REPOSITORY)),
    __param(1, (0, common_1.Inject)(shop_request_repository_1.SHOP_REQUEST_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object, cloudinary_service_1.CloudinaryService])
], ShopService);
//# sourceMappingURL=shop.service.js.map