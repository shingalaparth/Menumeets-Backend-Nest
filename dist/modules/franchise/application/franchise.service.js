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
exports.FranchiseService = void 0;
const common_1 = require("@nestjs/common");
const franchise_repository_1 = require("../domain/franchise.repository");
const shop_service_1 = require("../../shop/application/shop.service");
let FranchiseService = class FranchiseService {
    constructor(repo, shopService) {
        this.repo = repo;
        this.shopService = shopService;
    }
    async createFranchise(ownerId, data) {
        const existing = await this.repo.findByOwnerId(ownerId);
        if (existing)
            throw new common_1.BadRequestException('Owner already has a franchise');
        return this.repo.create({
            ownerId,
            name: data.name,
            logo: data.logo,
            description: data.description,
            settings: data.settings || {},
            contact: data.contact || {}
        });
    }
    async getMyFranchise(ownerId) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise)
            throw new common_1.NotFoundException('Franchise not found');
        return franchise;
    }
    async updateFranchise(ownerId, data) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise)
            throw new common_1.NotFoundException('Franchise not found');
        return this.repo.update(franchise.id, data);
    }
    async addOutlet(ownerId, shopId) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise)
            throw new common_1.NotFoundException('Franchise not found');
        await this.repo.addShop(franchise.id, shopId);
        return { message: 'Outlet added successfully' };
    }
    async removeOutlet(ownerId, shopId) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise)
            throw new common_1.NotFoundException('Franchise not found');
        await this.repo.removeShop(franchise.id, shopId);
        return { message: 'Outlet removed successfully' };
    }
    async getOutlets(ownerId) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise)
            throw new common_1.NotFoundException('Franchise not found');
        return this.repo.getOutlets(franchise.id);
    }
    async addManager(ownerId, managerVendorId, body) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise)
            throw new common_1.NotFoundException('Franchise not found');
        return this.repo.addManager(franchise.id, managerVendorId, body);
    }
    async removeManager(ownerId, managerVendorId) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise)
            throw new common_1.NotFoundException('Franchise not found');
        return this.repo.removeManager(franchise.id, managerVendorId);
    }
    async getManagers(ownerId) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise)
            throw new common_1.NotFoundException('Franchise not found');
        return this.repo.getManagers(franchise.id);
    }
    async getFranchiseAnalytics(ownerId, duration) {
        const franchise = await this.repo.findByOwnerId(ownerId);
        if (!franchise)
            throw new common_1.NotFoundException('Franchise not found');
        return this.repo.getAnalytics(franchise.id, duration);
    }
};
exports.FranchiseService = FranchiseService;
exports.FranchiseService = FranchiseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(franchise_repository_1.FRANCHISE_REPOSITORY)),
    __metadata("design:paramtypes", [Object, shop_service_1.ShopService])
], FranchiseService);
//# sourceMappingURL=franchise.service.js.map