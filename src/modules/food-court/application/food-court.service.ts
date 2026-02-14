import { Injectable, Inject, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { FOOD_COURT_REPOSITORY, FoodCourtRepository } from '../domain/food-court.repository';
import { ShopService } from '../../shop/application/shop.service';
import { SHOP_REQUEST_REPOSITORY, ShopRequestRepository } from '../../shop/domain/shop-request.repository';

@Injectable()
export class FoodCourtService {
    constructor(
        @Inject(FOOD_COURT_REPOSITORY) private repo: FoodCourtRepository,
        @Inject(SHOP_REQUEST_REPOSITORY) private requestRepo: ShopRequestRepository,
        private shopService: ShopService
    ) { }

    async createFoodCourt(managerId: string, data: any) {
        return this.repo.create({
            name: data.name,
            address: data.address,
            city: data.city,
            managerId,
            isActive: true
        });
    }

    async getFoodCourt(id: string) {
        const fc = await this.repo.findById(id);
        if (!fc) throw new NotFoundException('Food Court not found');
        return fc;
    }

    async updateFoodCourt(id: string, data: any) {
        const fc = await this.repo.findById(id);
        if (!fc) throw new NotFoundException('Food Court not found');
        return this.repo.update(id, data);
    }

    async addShop(foodCourtId: string, shopId: string) {
        const fc = await this.repo.findById(foodCourtId);
        if (!fc) throw new NotFoundException('Food Court not found');

        await this.repo.addShop(foodCourtId, shopId);
        return { message: 'Shop added to Food Court' };
    }

    async removeShop(foodCourtId: string, shopId: string) {
        return this.repo.removeShop(foodCourtId, shopId);
    }

    // ── Join Requests ──

    async requestToJoin(shopId: string, foodCourtId: string) {
        // Typically initiated by Shop. ensuring parity.
        return { message: "Please use Shop API to apply." };
    }

    async getJoinRequests(foodCourtId: string) {
        return this.requestRepo.findByFoodCourtId(foodCourtId);
    }

    async resolveJoinRequest(foodCourtId: string, requestId: string, accept: boolean) {
        const request = await this.requestRepo.findById(requestId);
        if (!request) throw new NotFoundException('Request not found');

        if (request.foodCourtId && request.foodCourtId !== foodCourtId) {
            throw new ForbiddenException('Request does not belong to this Food Court');
        }

        if (accept) {
            // Add shop to Food Court
            await this.repo.addShop(foodCourtId, request.shopId);
            await this.requestRepo.update(requestId, { status: 'ACCEPTED' });
        } else {
            await this.requestRepo.update(requestId, { status: 'REJECTED' });
        }
        return { message: `Request ${accept ? 'accepted' : 'rejected'}` };
    }

    // ── Analytics ──

    async getAnalytics(foodCourtId: string, duration: string) {
        return this.repo.getAnalytics(foodCourtId, duration);
    }

    async getShops(foodCourtId: string) {
        const fc = await this.repo.findById(foodCourtId);
        if (!fc) throw new NotFoundException('Food Court not found');

        return this.repo.getShops(foodCourtId);
    }

    async getAllFoodCourts() {
        return this.repo.findAll();
    }
}
