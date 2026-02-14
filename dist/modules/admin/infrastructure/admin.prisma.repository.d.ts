import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { AdminRepository } from '../domain/admin.repository';
import { Shop, Vendor, AdminBroadcast, FoodCourt } from '@prisma/client';
export declare class AdminPrismaRepository implements AdminRepository {
    private prisma;
    constructor(prisma: PrismaService);
    getGlobalStats(): Promise<any>;
    getAllShops(skip?: number, take?: number): Promise<Shop[]>;
    findShopById(id: string): Promise<Shop | null>;
    updateShop(id: string, data: any): Promise<Shop>;
    deleteShop(id: string): Promise<void>;
    countShops(): Promise<number>;
    getAllVendors(skip?: number, take?: number): Promise<Vendor[]>;
    findVendorById(id: string): Promise<Vendor | null>;
    updateVendor(id: string, data: any): Promise<Vendor>;
    countVendors(): Promise<number>;
    createBroadcast(data: any): Promise<AdminBroadcast>;
    getBroadcasts(limit?: number): Promise<AdminBroadcast[]>;
    getAllFoodCourts(): Promise<FoodCourt[]>;
}
