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
exports.VendorService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_service_1 = require("../../../infrastructure/external/cloudinary.service");
const hash_util_1 = require("../../../shared/utils/hash.util");
const vendor_repository_1 = require("../domain/vendor.repository");
let VendorService = class VendorService {
    constructor(vendorRepo, cloudinary) {
        this.vendorRepo = vendorRepo;
        this.cloudinary = cloudinary;
    }
    async getProfile(vendorId) {
        const vendor = await this.vendorRepo.findById(vendorId);
        if (!vendor)
            throw new common_1.NotFoundException('Vendor not found');
        const { password: _, ...safeVendor } = vendor;
        return safeVendor;
    }
    async updateProfile(vendorId, updates, avatarFile) {
        const vendor = await this.vendorRepo.findById(vendorId);
        if (!vendor)
            throw new common_1.NotFoundException('Vendor not found');
        const data = {};
        if (updates.name)
            data.name = updates.name;
        if (updates.number)
            data.phone = updates.number;
        if (updates.altPhone || updates.gender || updates.dob || avatarFile) {
            const currentInfo = vendor.personalInfo || {};
            if (updates.altPhone)
                currentInfo.altPhone = updates.altPhone;
            if (updates.gender)
                currentInfo.gender = updates.gender;
            if (updates.dob)
                currentInfo.dob = updates.dob;
            if (avatarFile) {
                if (currentInfo.avatar?.publicId) {
                    await this.cloudinary.deleteImage(currentInfo.avatar.publicId);
                }
                const result = await this.cloudinary.uploadImage(avatarFile.buffer, 'vendor-avatars');
                currentInfo.avatar = { url: result.secure_url, publicId: result.public_id };
            }
            data.personalInfo = currentInfo;
        }
        if (updates.notificationPreferences) {
            const prefs = typeof updates.notificationPreferences === 'string'
                ? JSON.parse(updates.notificationPreferences)
                : updates.notificationPreferences;
            const current = vendor.notificationPreferences || {};
            data.notificationPreferences = { ...current, ...prefs };
        }
        if (updates.permissions) {
            const perms = typeof updates.permissions === 'string'
                ? JSON.parse(updates.permissions) : updates.permissions;
            const current = vendor.permissions || {};
            data.permissions = { ...current, ...perms };
        }
        if (updates.security) {
            const sec = typeof updates.security === 'string'
                ? JSON.parse(updates.security) : updates.security;
            const current = vendor.security || {};
            if (sec.twoFactorEnabled !== undefined) {
                current.twoFactorEnabled = sec.twoFactorEnabled;
            }
            data.security = current;
        }
        const updated = await this.vendorRepo.update(vendorId, data);
        await this.logActivity(vendorId, 'UPDATE_PROFILE', 'Updated personal info/settings');
        const { password: _, ...safeVendor } = updated;
        return safeVendor;
    }
    async deleteVendor(vendorId) {
        await this.vendorRepo.delete(vendorId);
        return { message: 'Vendor account deleted successfully' };
    }
    async updateKYC(vendorId, updates, files) {
        const vendor = await this.vendorRepo.findById(vendorId);
        if (!vendor)
            throw new common_1.NotFoundException('Vendor not found');
        const kyc = vendor.kyc || {};
        if (updates.aadhaarNumber)
            kyc.aadhaarNumber = updates.aadhaarNumber;
        if (updates.panNumber)
            kyc.panNumber = updates.panNumber;
        const uploadField = async (fieldName) => {
            if (files[fieldName]?.[0]) {
                const file = files[fieldName][0];
                if (kyc[fieldName]?.publicId) {
                    await this.cloudinary.deleteImage(kyc[fieldName].publicId);
                }
                const result = await this.cloudinary.uploadImage(file.buffer, 'vendor-kyc');
                kyc[fieldName] = { url: result.secure_url, publicId: result.public_id };
            }
        };
        await uploadField('aadhaarFrontImage');
        await uploadField('aadhaarBackImage');
        await uploadField('panImage');
        await uploadField('signatureImage');
        kyc.status = 'Pending';
        await this.vendorRepo.update(vendorId, { kyc });
        await this.logActivity(vendorId, 'UPDATE_KYC', 'Updated KYC details');
        return kyc;
    }
    async updateBankDetails(vendorId, updates, files) {
        const vendor = await this.vendorRepo.findById(vendorId);
        if (!vendor)
            throw new common_1.NotFoundException('Vendor not found');
        const bank = vendor.bankDetails || {};
        const textFields = ['accountHolderName', 'accountNumber', 'ifscCode', 'bankName', 'branch', 'upiId'];
        for (const field of textFields) {
            if (updates[field])
                bank[field] = updates[field];
        }
        const uploadField = async (fieldName) => {
            if (files[fieldName]?.[0]) {
                const file = files[fieldName][0];
                if (bank[fieldName]?.publicId) {
                    await this.cloudinary.deleteImage(bank[fieldName].publicId);
                }
                const result = await this.cloudinary.uploadImage(file.buffer, 'vendor-bank');
                bank[fieldName] = { url: result.secure_url, publicId: result.public_id };
            }
        };
        await uploadField('cancelledChequeImage');
        await uploadField('passbookImage');
        bank.status = 'Pending';
        await this.vendorRepo.update(vendorId, { bankDetails: bank });
        await this.logActivity(vendorId, 'UPDATE_BANK', 'Updated bank details');
        return bank;
    }
    async changePassword(vendorId, currentPassword, newPassword) {
        if (!currentPassword || !newPassword) {
            throw new common_1.BadRequestException('Please provide both current and new passwords');
        }
        const vendor = await this.vendorRepo.findById(vendorId);
        if (!vendor)
            throw new common_1.NotFoundException('Vendor not found');
        const isMatch = await (0, hash_util_1.comparePassword)(currentPassword, vendor.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Incorrect current password');
        }
        await this.vendorRepo.update(vendorId, { password: newPassword });
        await this.logActivity(vendorId, 'CHANGE_PASSWORD', 'Password updated successfully');
        return { message: 'Password updated successfully' };
    }
    async getActivityLogs(vendorId) {
        return this.vendorRepo.findActivityLogs(vendorId);
    }
    async logActivity(vendorId, action, details, ip, device) {
        await this.vendorRepo.createActivityLog({ vendorId, action, details, ip, device });
    }
    async findByEmail(email) {
        return this.vendorRepo.findByEmail(email);
    }
    async findByEmailOrPhone(email, phone) {
        return this.vendorRepo.findByEmailOrPhone(email, phone);
    }
    async create(data) {
        return this.vendorRepo.create(data);
    }
    async findAll() {
        return this.vendorRepo.findAll();
    }
};
exports.VendorService = VendorService;
exports.VendorService = VendorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(vendor_repository_1.VENDOR_REPOSITORY)),
    __metadata("design:paramtypes", [Object, cloudinary_service_1.CloudinaryService])
], VendorService);
//# sourceMappingURL=vendor.service.js.map