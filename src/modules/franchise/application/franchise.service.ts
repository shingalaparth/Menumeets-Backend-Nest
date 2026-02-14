import { Injectable, Inject, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { FRANCHISE_REPOSITORY, FranchiseRepository } from '../domain/franchise.repository';
import { ShopService } from '../../shop/application/shop.service';
// import { VendorService } from '../../vendor/application/vendor.service'; // Needed to verify owner?

@Injectable()
export class FranchiseService {
    constructor(
        @Inject(FRANCHISE_REPOSITORY) private repo: FranchiseRepository,
        private shopService: ShopService
    ) { }

    async createFranchise(ownerId: string, data: any) {
        // Check if owner already has a franchise
        const existing = await this.repo.findByOwnerId(ownerId);
        if (existing) throw new BadRequestException('Owner already has a franchise');

        return this.repo.create({
            ownerId,
            name: data.name,
            logo: data.logo,
            description: data.description,
            settings: data.settings || {},
            contact: data.contact || {}
        });
    }

    async getMyFranchise(ownerId: string) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise) throw new NotFoundException('Franchise not found');
        return franchise;
    }

    async updateFranchise(ownerId: string, data: any) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise) throw new NotFoundException('Franchise not found');

        return this.repo.update(franchise.id, data);
    }

    async addOutlet(ownerId: string, shopId: string) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise) throw new NotFoundException('Franchise not found');

        // Verify shop ownership or permission?
        // Ideally, the shop should be owned by the same vendor OR the vendor has permission.
        // For MVP, simplify: allow linking any shop if provided shopId is valid (and maybe check ownership via ShopService)
        // const shop = await this.shopService.getShopById(shopId);
        // if (shop.ownerId !== ownerId) ... (This restriction might be too strict if franchise allows franchising to others)

        // For now, allow linking.
        await this.repo.addShop(franchise.id, shopId);
        return { message: 'Outlet added successfully' };
    }

    async removeOutlet(ownerId: string, shopId: string) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise) throw new NotFoundException('Franchise not found');

        await this.repo.removeShop(franchise.id, shopId);
        return { message: 'Outlet removed successfully' };
    }

    async getOutlets(ownerId: string) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise) throw new NotFoundException('Franchise not found');

        return this.repo.getOutlets(franchise.id);
    }

    // ── Managers (Manipulating Vendor.franchiseRoles) ──

    async addManager(ownerId: string, managerVendorId: string, body: any) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise) throw new NotFoundException('Franchise not found');

        // This logic belongs in the Repository or Vendor Service?
        // Ideally, FranchiseService calls VendorService to update roles.
        // But for now, let's keep it here or call a repository method.
        // Let's assume we implement `addManager` in FranchiseRepository to encapsulate Prisma calls.
        return this.repo.addManager(franchise.id, managerVendorId, body);
    }

    async removeManager(ownerId: string, managerVendorId: string) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise) throw new NotFoundException('Franchise not found');
        return this.repo.removeManager(franchise.id, managerVendorId);
    }

    async getManagers(ownerId: string) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise) throw new NotFoundException('Franchise not found');
        return this.repo.getManagers(franchise.id);
    }

    // ── Analytics ──

    async getFranchiseAnalytics(ownerId: string, duration: string) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise) throw new NotFoundException('Franchise not found');

        return this.repo.getAnalytics(franchise.id, duration);
    }
}
