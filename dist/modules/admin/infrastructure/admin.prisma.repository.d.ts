import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { AdminRepository } from '../domain/admin.repository';
import { Shop, Vendor, AdminBroadcast, FoodCourt, Order, User, SystemConfig } from '@prisma/client';
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
    deleteVendor(id: string): Promise<void>;
    countVendors(): Promise<number>;
    createBroadcast(data: any): Promise<AdminBroadcast>;
    getBroadcasts(limit?: number): Promise<AdminBroadcast[]>;
    getAllFoodCourts(): Promise<FoodCourt[]>;
    getAllOrders(skip?: number, take?: number, filters?: any): Promise<{
        orders: Order[];
        total: number;
    }>;
    findOrderById(id: string): Promise<Order | null>;
    updateOrderStatus(id: string, status: string): Promise<Order>;
    getAllUsers(skip?: number, take?: number): Promise<{
        users: User[];
        total: number;
    }>;
    findUserById(id: string): Promise<User | null>;
    getSystemConfigs(): Promise<SystemConfig[]>;
    upsertSystemConfig(key: string, value: any, description?: string): Promise<SystemConfig>;
    getRevenueReport(startDate: Date, endDate: Date): Promise<any>;
    getTopSellingItems(limit?: number, startDate?: Date, endDate?: Date): Promise<any[]>;
}
