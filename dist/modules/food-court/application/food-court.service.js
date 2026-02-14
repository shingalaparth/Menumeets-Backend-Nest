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
exports.FoodCourtService = void 0;
const common_1 = require("@nestjs/common");
const food_court_repository_1 = require("../domain/food-court.repository");
const shop_service_1 = require("../../shop/application/shop.service");
const shop_request_repository_1 = require("../../shop/domain/shop-request.repository");
let FoodCourtService = class FoodCourtService {
    constructor(repo, requestRepo, shopService) {
        this.repo = repo;
        this.requestRepo = requestRepo;
        this.shopService = shopService;
    }
    async createFoodCourt(managerId, data) {
        return this.repo.create({
            name: data.name,
            address: data.address,
            city: data.city,
            managerId,
            isActive: true
        });
    }
    async getFoodCourt(id) {
        const fc = await this.repo.findById(id);
        if (!fc)
            throw new common_1.NotFoundException('Food Court not found');
        return fc;
    }
    async updateFoodCourt(id, data) {
        const fc = await this.repo.findById(id);
        if (!fc)
            throw new common_1.NotFoundException('Food Court not found');
        return this.repo.update(id, data);
    }
    async addShop(foodCourtId, shopId) {
        const fc = await this.repo.findById(foodCourtId);
        if (!fc)
            throw new common_1.NotFoundException('Food Court not found');
        await this.repo.addShop(foodCourtId, shopId);
        return { message: 'Shop added to Food Court' };
    }
    async removeShop(foodCourtId, shopId) {
        return this.repo.removeShop(foodCourtId, shopId);
    }
    async requestToJoin(shopId, foodCourtId) {
        return { message: "Please use Shop API to apply." };
    }
    async getJoinRequests(foodCourtId) {
        return this.requestRepo.findByFoodCourtId(foodCourtId);
    }
    async resolveJoinRequest(foodCourtId, requestId, accept) {
        const request = await this.requestRepo.findById(requestId);
        if (!request)
            throw new common_1.NotFoundException('Request not found');
        if (request.foodCourtId && request.foodCourtId !== foodCourtId) {
            throw new common_1.ForbiddenException('Request does not belong to this Food Court');
        }
        if (accept) {
            await this.repo.addShop(foodCourtId, request.shopId);
            await this.requestRepo.update(requestId, { status: 'ACCEPTED' });
        }
        else {
            await this.requestRepo.update(requestId, { status: 'REJECTED' });
        }
        return { message: `Request ${accept ? 'accepted' : 'rejected'}` };
    }
    async getAnalytics(foodCourtId, duration) {
        return this.repo.getAnalytics(foodCourtId, duration);
    }
    async getShops(foodCourtId) {
        const fc = await this.repo.findById(foodCourtId);
        if (!fc)
            throw new common_1.NotFoundException('Food Court not found');
        return this.repo.getShops(foodCourtId);
    }
    async getAllFoodCourts() {
        return this.repo.findAll();
    }
};
exports.FoodCourtService = FoodCourtService;
exports.FoodCourtService = FoodCourtService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(food_court_repository_1.FOOD_COURT_REPOSITORY)),
    __param(1, (0, common_1.Inject)(shop_request_repository_1.SHOP_REQUEST_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object, shop_service_1.ShopService])
], FoodCourtService);
//# sourceMappingURL=food-court.service.js.map