import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { FoodCourtRepository } from '../domain/food-court.repository';
import { FoodCourt } from '@prisma/client';
export declare class FoodCourtPrismaRepository implements FoodCourtRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<FoodCourt>;
    findById(id: string): Promise<FoodCourt | null>;
    update(id: string, data: any): Promise<FoodCourt>;
    addShop(foodCourtId: string, shopId: string): Promise<void>;
    removeShop(foodCourtId: string, shopId: string): Promise<void>;
    getAnalytics(foodCourtId: string, duration: string): Promise<any>;
    getShops(foodCourtId: string): Promise<any[]>;
    findAll(): Promise<FoodCourt[]>;
}
