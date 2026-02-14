import { FoodCourtRepository } from '../domain/food-court.repository';
import { ShopService } from '../../shop/application/shop.service';
import { ShopRequestRepository } from '../../shop/domain/shop-request.repository';
export declare class FoodCourtService {
    private repo;
    private requestRepo;
    private shopService;
    constructor(repo: FoodCourtRepository, requestRepo: ShopRequestRepository, shopService: ShopService);
    createFoodCourt(managerId: string, data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        address: string;
        isActive: boolean;
        city: string;
        managerId: string | null;
    }>;
    getFoodCourt(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        address: string;
        isActive: boolean;
        city: string;
        managerId: string | null;
    }>;
    updateFoodCourt(id: string, data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        address: string;
        isActive: boolean;
        city: string;
        managerId: string | null;
    }>;
    addShop(foodCourtId: string, shopId: string): Promise<{
        message: string;
    }>;
    removeShop(foodCourtId: string, shopId: string): Promise<void>;
    requestToJoin(shopId: string, foodCourtId: string): Promise<{
        message: string;
    }>;
    getJoinRequests(foodCourtId: string): Promise<any[]>;
    resolveJoinRequest(foodCourtId: string, requestId: string, accept: boolean): Promise<{
        message: string;
    }>;
    getAnalytics(foodCourtId: string, duration: string): Promise<any>;
    getShops(foodCourtId: string): Promise<any[]>;
    getAllFoodCourts(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        address: string;
        isActive: boolean;
        city: string;
        managerId: string | null;
    }[]>;
}
