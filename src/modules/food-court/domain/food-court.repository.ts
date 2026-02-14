import { FoodCourt } from '@prisma/client';

export interface FoodCourtRepository {
    create(data: any): Promise<FoodCourt>;
    findById(id: string): Promise<FoodCourt | null>;
    update(id: string, data: any): Promise<FoodCourt>;
    addShop(foodCourtId: string, shopId: string): Promise<void>;
    removeShop(foodCourtId: string, shopId: string): Promise<void>;
    getAnalytics(foodCourtId: string, duration: string): Promise<any>;
    getShops(foodCourtId: string): Promise<any[]>;
    findAll(): Promise<FoodCourt[]>;
}

export const FOOD_COURT_REPOSITORY = 'FOOD_COURT_REPOSITORY';
