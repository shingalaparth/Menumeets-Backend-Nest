import { Shop, Vendor, AdminBroadcast, FoodCourt, Order, User, SystemConfig } from '@prisma/client';

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
    deleteVendor(id: string): Promise<void>;
    countVendors(): Promise<number>;

    // Broadcasts
    createBroadcast(data: any): Promise<AdminBroadcast>;
    getBroadcasts(limit?: number): Promise<AdminBroadcast[]>;

    // Food Courts
    getAllFoodCourts(): Promise<FoodCourt[]>;

    // ── Parity additions ──

    // Orders
    getAllOrders(skip: number, take: number, filters?: any): Promise<{ orders: Order[]; total: number }>;
    findOrderById(id: string): Promise<Order | null>;
    updateOrderStatus(id: string, status: string): Promise<Order>;

    // Users
    getAllUsers(skip: number, take: number): Promise<{ users: User[]; total: number }>;
    findUserById(id: string): Promise<User | null>;

    // System Config
    getSystemConfigs(): Promise<SystemConfig[]>;
    upsertSystemConfig(key: string, value: any, description?: string): Promise<SystemConfig>;

    // Reports
    getRevenueReport(startDate: Date, endDate: Date): Promise<any>;
    getTopSellingItems(limit: number, startDate?: Date, endDate?: Date): Promise<any[]>;
}

export const ADMIN_REPOSITORY = 'ADMIN_REPOSITORY';
