/**
 * Vendor Service — Application layer
 * Depends on VendorRepository interface (injected), NOT on PrismaService directly.
 * Handles profile updates, KYC, bank details, activity logs, password change, delete.
 */
import {
    Injectable,
    Inject,
    NotFoundException,
    UnauthorizedException,
    BadRequestException,
} from '@nestjs/common';
import { CloudinaryService } from '../../../infrastructure/external/cloudinary.service';
import { comparePassword } from '../../../shared/utils/hash.util';
import { VENDOR_REPOSITORY, VendorRepository } from '../domain/vendor.repository';

@Injectable()
export class VendorService {
    constructor(
        @Inject(VENDOR_REPOSITORY) private vendorRepo: VendorRepository,
        private cloudinary: CloudinaryService,
    ) { }

    // ── Profile ──

    async getProfile(vendorId: string) {
        const vendor = await this.vendorRepo.findById(vendorId);
        if (!vendor) throw new NotFoundException('Vendor not found');
        const { password: _, ...safeVendor } = vendor;
        return safeVendor;
    }

    async updateProfile(vendorId: string, updates: any, avatarFile?: Express.Multer.File) {
        const vendor = await this.vendorRepo.findById(vendorId);
        if (!vendor) throw new NotFoundException('Vendor not found');

        const data: any = {};

        // Basic Info
        if (updates.name) data.name = updates.name;
        if (updates.number) data.phone = updates.number;

        // Personal Info (JSON merge)
        if (updates.altPhone || updates.gender || updates.dob || avatarFile) {
            const currentInfo = (vendor.personalInfo as any) || {};
            if (updates.altPhone) currentInfo.altPhone = updates.altPhone;
            if (updates.gender) currentInfo.gender = updates.gender;
            if (updates.dob) currentInfo.dob = updates.dob;

            if (avatarFile) {
                if (currentInfo.avatar?.publicId) {
                    await this.cloudinary.deleteImage(currentInfo.avatar.publicId);
                }
                const result = await this.cloudinary.uploadImage(avatarFile.buffer, 'vendor-avatars');
                currentInfo.avatar = { url: result.secure_url, publicId: result.public_id };
            }

            data.personalInfo = currentInfo;
        }

        // Notification Preferences (JSON merge)
        if (updates.notificationPreferences) {
            const prefs = typeof updates.notificationPreferences === 'string'
                ? JSON.parse(updates.notificationPreferences)
                : updates.notificationPreferences;
            const current = (vendor.notificationPreferences as any) || {};
            data.notificationPreferences = { ...current, ...prefs };
        }

        // Permissions (JSON merge)
        if (updates.permissions) {
            const perms = typeof updates.permissions === 'string'
                ? JSON.parse(updates.permissions) : updates.permissions;
            const current = (vendor.permissions as any) || {};
            data.permissions = { ...current, ...perms };
        }

        // Security (2FA toggle)
        if (updates.security) {
            const sec = typeof updates.security === 'string'
                ? JSON.parse(updates.security) : updates.security;
            const current = (vendor.security as any) || {};
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

    async deleteVendor(vendorId: string) {
        await this.vendorRepo.delete(vendorId);
        return { message: 'Vendor account deleted successfully' };
    }

    // ── KYC ──

    async updateKYC(vendorId: string, updates: any, files: Record<string, Express.Multer.File[]>) {
        const vendor = await this.vendorRepo.findById(vendorId);
        if (!vendor) throw new NotFoundException('Vendor not found');

        const kyc = (vendor.kyc as any) || {};

        if (updates.aadhaarNumber) kyc.aadhaarNumber = updates.aadhaarNumber;
        if (updates.panNumber) kyc.panNumber = updates.panNumber;

        const uploadField = async (fieldName: string) => {
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

    // ── Bank Details ──

    async updateBankDetails(vendorId: string, updates: any, files: Record<string, Express.Multer.File[]>) {
        const vendor = await this.vendorRepo.findById(vendorId);
        if (!vendor) throw new NotFoundException('Vendor not found');

        const bank = (vendor.bankDetails as any) || {};

        const textFields = ['accountHolderName', 'accountNumber', 'ifscCode', 'bankName', 'branch', 'upiId'];
        for (const field of textFields) {
            if (updates[field]) bank[field] = updates[field];
        }

        const uploadField = async (fieldName: string) => {
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

    // ── Password ──

    async changePassword(vendorId: string, currentPassword: string, newPassword: string) {
        if (!currentPassword || !newPassword) {
            throw new BadRequestException('Please provide both current and new passwords');
        }

        const vendor = await this.vendorRepo.findById(vendorId);
        if (!vendor) throw new NotFoundException('Vendor not found');

        const isMatch = await comparePassword(currentPassword, vendor.password);
        if (!isMatch) {
            throw new UnauthorizedException('Incorrect current password');
        }

        // Password hashing is handled in the repository layer
        await this.vendorRepo.update(vendorId, { password: newPassword });
        await this.logActivity(vendorId, 'CHANGE_PASSWORD', 'Password updated successfully');

        return { message: 'Password updated successfully' };
    }

    // ── Activity Logs ──

    async getActivityLogs(vendorId: string) {
        return this.vendorRepo.findActivityLogs(vendorId);
    }

    async logActivity(vendorId: string, action: string, details?: string, ip?: string, device?: string) {
        await this.vendorRepo.createActivityLog({ vendorId, action, details, ip, device });
    }

    // ── Helpers for Auth Module ──

    async findByEmail(email: string) {
        return this.vendorRepo.findByEmail(email);
    }

    async findByEmailOrPhone(email: string, phone: string) {
        return this.vendorRepo.findByEmailOrPhone(email, phone);
    }

    async create(data: { name: string; email: string; phone: string; password: string }) {
        return this.vendorRepo.create(data);
    }

    async findAll() {
        return this.vendorRepo.findAll();
    }
}
