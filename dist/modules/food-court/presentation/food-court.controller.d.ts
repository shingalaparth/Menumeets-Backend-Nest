import { FoodCourtService } from '../application/food-court.service';
export declare class FoodCourtController {
    private readonly service;
    constructor(service: FoodCourtService);
    createFoodCourt(req: any, body: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        address: string;
        isActive: boolean;
        city: string;
        managerId: string | null;
    }>;
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
    updateFoodCourt(id: string, body: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        address: string;
        isActive: boolean;
        city: string;
        managerId: string | null;
    }>;
    getShops(id: string): Promise<any[]>;
    addShop(id: string, body: {
        shopId: string;
    }): Promise<{
        message: string;
    }>;
    removeShop(id: string, shopId: string): Promise<void>;
    requestToJoin(foodCourtId: string, shopId: string, vendor: any): Promise<{
        message: string;
    }>;
    getJoinRequests(foodCourtId: string, vendor: any): Promise<any[]>;
    resolveJoinRequest(foodCourtId: string, requestId: string, body: {
        accept: boolean;
    }, vendor: any): Promise<{
        message: string;
    }>;
    getAnalytics(foodCourtId: string, duration: string | undefined, vendor: any): Promise<any>;
}
