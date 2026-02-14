import { Shop, Vendor, AdminBroadcast, FoodCourt } from '@prisma/client';

export interface AdminRepository {
    // Stats
    getGlobalStats(): Promise<any>;

    // Shops
    getAllShops(skip?: number, take?: number): Promise<Shop[]>;
    findShopById(id: string): Promise<Shop | null>;
    updateShop(id: string, data: any): Promise<Shop>;
    deleteShop(id: string): Promise<void>;
    countShops(): Promise<number>;

    // Vendors
    getAllVendors(skip?: number, take?: number): Promise<Vendor[]>;
    findVendorById(id: string): Promise<Vendor | null>;
    updateVendor(id: string, data: any): Promise<Vendor>;
    countVendors(): Promise<number>;

    // Broadcasts
    createBroadcast(data: any): Promise<AdminBroadcast>;
    getBroadcasts(limit?: number): Promise<AdminBroadcast[]>;

    // Food Courts
    getAllFoodCourts(): Promise<FoodCourt[]>;
    // getRemovalRequests(): Promise<FoodCourtApplication[]>;
    // resolveRemovalRequest(id: string, status: string): Promise<FoodCourtApplication>;
}

export const ADMIN_REPOSITORY = 'ADMIN_REPOSITORY';
