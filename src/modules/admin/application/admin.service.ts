import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AdminRepository, ADMIN_REPOSITORY } from '../domain/admin.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
    constructor(
        @Inject(ADMIN_REPOSITORY) private readonly repo: AdminRepository,
        private jwtService: JwtService
    ) { }

    async getDashboardStats() {
        return this.repo.getGlobalStats();
    }

    // --- Shops ---
    async getAllShops() {
        const shops = await this.repo.getAllShops(0, 100);
        return { count: shops.length, data: shops };
    }

    async updateShopStatus(shopId: string) {
        const shop = await this.repo.findShopById(shopId);
        if (!shop) throw new NotFoundException('Shop not found');

        return this.repo.updateShop(shopId, { isActive: !shop.isActive });
    }

    async updateShopCommission(shopId: string, commission: number) {
        const shop = await this.repo.findShopById(shopId);
        if (!shop) throw new NotFoundException('Shop not found');

        const settings = (shop.settings as any) || {};
        const profile = settings.profile || {};
        profile.platformCommission = commission;
        settings.profile = profile;

        return this.repo.updateShop(shopId, { settings });
    }

    // --- Vendors ---
    async getAllVendors() {
        const vendors = await this.repo.getAllVendors(0, 100);
        return { count: vendors.length, data: vendors };
    }

    async impersonateVendor(vendorId: string) {
        const vendor = await this.repo.findVendorById(vendorId);
        if (!vendor) throw new NotFoundException('Vendor not found');

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

    async resetVendorPassword(vendorId: string, newPass: string) {
        const vendor = await this.repo.findVendorById(vendorId);
        if (!vendor) throw new NotFoundException('Vendor not found');

        const hashedPassword = await bcrypt.hash(newPass, 10);
        await this.repo.updateVendor(vendorId, { password: hashedPassword });

        return { message: 'Password reset successfully' };
    }

    // --- Broadcasts ---
    async sendBroadcast(title: string, message: string, recipientId?: string) {
        return this.repo.createBroadcast({
            title,
            message,
            recipientId: recipientId || null
        });
    }

    async getBroadcasts() {
        return this.repo.getBroadcasts();
    }
}
