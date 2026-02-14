/**
 * Shop Service — Application layer
 * Depends on ShopRepository (via @Inject) and CloudinaryService.
 * Handles shop CRUD, settings updates, file uploads, and ownership checks.
 *
 * Cross-module endpoints (messages, food-court applications) are deferred
 * until those modules are migrated — they'll use their own services then.
 */
import {
    Injectable,
    Inject,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
} from '@nestjs/common';
import { CloudinaryService } from '../../../infrastructure/external/cloudinary.service';
import { SHOP_REPOSITORY, ShopRepository } from '../domain/shop.repository';
import { SHOP_REQUEST_REPOSITORY, ShopRequestRepository } from '../domain/shop-request.repository';
import { ShopEntity, ShopSettings } from '../domain/shop.entity';

// Safe JSON parser (same as old controller)
const parseJSON = (value: any) => {
    try { return typeof value === 'string' ? JSON.parse(value) : value; }
    catch { return null; }
};

@Injectable()
export class ShopService {
    constructor(
        @Inject(SHOP_REPOSITORY) private shopRepo: ShopRepository,
        @Inject(SHOP_REQUEST_REPOSITORY) private requestRepo: ShopRequestRepository,
        private cloudinary: CloudinaryService,
    ) { }

    /**
     * Verify vendor owns this shop (or is staff assigned to it).
     * Returns the shop if valid, throws otherwise.
     */
    async checkOwnership(shopId: string, vendor: any): Promise<ShopEntity> {
        const shop = await this.shopRepo.findById(shopId);
        if (!shop) throw new NotFoundException('Shop not found');

        const isOwner = shop.ownerId === vendor.id;
        const isStaff = vendor.managesShop === shop.id;

        if (!isOwner && !isStaff) {
            throw new ForbiddenException('You do not have access to this shop');
        }
        return shop;
    }

    // ── CRUD ──

    async createShop(vendorId: string, data: { name: string; address?: string; phone?: string; businessType?: string }) {
        if (!data.name?.trim()) {
            throw new BadRequestException('Shop name is required');
        }
        return this.shopRepo.create({
            name: data.name.trim(),
            address: data.address?.trim() || '',
            phone: data.phone?.trim() || '',
            businessType: data.businessType || 'Restaurant',
            ownerId: vendorId,
        });
    }

    async getMyShops(vendor: any) {
        if (vendor.managesShop) {
            // Staff: return only their assigned shop
            return this.shopRepo.findByIds([vendor.managesShop]);
        }
        // Owner: return all their shops
        return this.shopRepo.findByOwnerId(vendor.id);
    }

    async deleteShop(shopId: string, vendor: any) {
        const shop = await this.checkOwnership(shopId, vendor);

        // Clean up Cloudinary files
        const settings = shop.settings as ShopSettings | null;
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
            } catch (e) { console.error('QR delete error:', e); }
        }

        await this.shopRepo.delete(shopId);
        return { message: 'Shop deleted successfully' };
    }

    // ── UPDATE SHOP (Complex settings + file uploads) ──

    async updateShop(
        shopId: string,
        vendor: any,
        updates: any,
        files?: Record<string, Express.Multer.File[]>,
    ) {
        const shop = await this.checkOwnership(shopId, vendor);
        const data: any = {};

        // ── Basic fields ──
        if (updates.name?.trim()) data.name = updates.name.trim();
        if (updates.address?.trim()) data.address = updates.address.trim();
        if (updates.phone?.trim()) data.phone = updates.phone.trim();
        if (updates.captainPin?.trim()) data.captainPin = updates.captainPin.trim();
        if (updates.kotPin?.trim()) data.kotPin = updates.kotPin.trim();

        // ── Settings (JSON merge) ──
        const currentSettings: ShopSettings = (shop.settings as ShopSettings) || {};
        if (!currentSettings.profile) currentSettings.profile = {};
        const profile = currentSettings.profile;

        // Profile scalars
        if (updates.displayEmail !== undefined) profile.displayEmail = updates.displayEmail;
        if (updates.displayPhone !== undefined) profile.displayPhone = updates.displayPhone;
        if (updates.fssai !== undefined) profile.fssai = updates.fssai;
        if (updates.gstin !== undefined) profile.gstin = updates.gstin;
        if (updates.openingTime !== undefined) profile.openingTime = updates.openingTime;
        if (updates.closingTime !== undefined) profile.closingTime = updates.closingTime;

        if (updates.isTemporarilyClosed !== undefined) {
            profile.isTemporarilyClosed = updates.isTemporarilyClosed === 'true' || updates.isTemporarilyClosed === true;
        }
        if (updates.autoReopenDate !== undefined) {
            profile.autoReopenDate = updates.autoReopenDate;
        }

        // Off days
        if (updates.offDays) {
            const parsed = parseJSON(updates.offDays);
            if (parsed) profile.offDays = parsed;
        }

        // Service modes
        if (updates.serviceModes) {
            const parsed = parseJSON(updates.serviceModes);
            if (parsed) {
                if (!profile.serviceModes) profile.serviceModes = {};
                profile.serviceModes = { ...profile.serviceModes, ...parsed };
            }
        }

        // Tax
        if (updates.tax) {
            const parsed = parseJSON(updates.tax);
            if (parsed) {
                if (!currentSettings.tax) currentSettings.tax = {};
                currentSettings.tax = { ...currentSettings.tax, ...parsed };
            }
        }

        // Feature access (with entitlement validation)
        if (updates.featureAccess) {
            let parsed = parseJSON(updates.featureAccess);
            if (!parsed && updates.settings?.featureAccess) {
                parsed = updates.settings.featureAccess;
            }
            if (parsed) {
                if (!currentSettings.featureAccess) currentSettings.featureAccess = {};
                const entitlements = currentSettings.featureEntitlements || {};
                // Block features the admin has disabled
                Object.keys(parsed).forEach(key => {
                    if (parsed[key] === true && entitlements[key] === false) {
                        parsed[key] = false;
                    }
                });
                currentSettings.featureAccess = { ...currentSettings.featureAccess, ...parsed };
            }
        }

        // Sound preferences
        if (updates.soundPreferences) {
            const parsed = parseJSON(updates.soundPreferences);
            if (parsed) {
                data.soundPreferences = { ...(shop.soundPreferences as any || {}), ...parsed };
            }
        }

        // Quick access shortcuts (max 8)
        if (updates.quickAccess !== undefined) {
            const parsed = parseJSON(updates.quickAccess);
            if (Array.isArray(parsed)) {
                currentSettings.quickAccess = parsed.slice(0, 8);
            }
        }

        // Orientation mode
        if (updates.orientationMode !== undefined) {
            const validModes = ['auto', 'portrait', 'landscape'];
            if (validModes.includes(updates.orientationMode)) {
                currentSettings.orientationMode = updates.orientationMode;
            }
        }

        data.settings = currentSettings;

        // ── File uploads ──
        if (files) {
            if (files.logo?.[0]) {
                if (profile.logo?.publicId) {
                    await this.cloudinary.deleteImage(profile.logo.publicId);
                }
                const result = await this.cloudinary.uploadImage(files.logo[0].buffer, 'shop-logos');
                profile.logo = { url: result.secure_url, publicId: result.public_id };
                data.settings = currentSettings; // ensure settings obj includes updated profile
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
                    } catch (e) { console.error('QR delete error:', e); }
                }
                const result = await this.cloudinary.uploadImage(files.upiQrCode[0].buffer, 'menumeets/qr-codes');
                data.upiQrCodeUrl = result.secure_url;
            }
        }

        return this.shopRepo.update(shopId, data);
    }

    // ── UPI QR Code (standalone endpoint) ──

    async uploadUpiQrCode(shopId: string, vendor: any, file: Express.Multer.File) {
        const shop = await this.checkOwnership(shopId, vendor);

        if (!file) throw new BadRequestException('Please upload a QR code image.');

        // Delete old QR
        if (shop.upiQrCodeUrl) {
            try {
                const parts = shop.upiQrCodeUrl.split('/');
                const publicId = parts[parts.length - 1].split('.')[0];
                await this.cloudinary.deleteImage(`menumeets/qr-codes/${publicId}`);
            } catch (e) { console.error('QR delete error:', e); }
        }

        const result = await this.cloudinary.uploadImage(file.buffer, 'menumeets/qr-codes');
        await this.shopRepo.update(shopId, { upiQrCodeUrl: result.secure_url } as any);

        return { upiQrCodeUrl: result.secure_url };
    }

    // ── Helpers for other modules ──

    async findById(id: string) {
        return this.shopRepo.findById(id);
    }

    async getShopById(id: string) {
        return this.findById(id);
    }

    // ── Interactions (Phase 11) ──

    async applyToFoodCourt(vendorId: string, shopId: string, foodCourtId: string) {
        const shop = await this.checkOwnership(shopId, { id: vendorId });

        // Check if request already exists?
        // Ideally we check `requestRepo.findByShopId` and filter.
        // For MVP, just create a new one.

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
}
