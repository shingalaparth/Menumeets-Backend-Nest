import { FranchiseRepository } from '../domain/franchise.repository';
import { ShopService } from '../../shop/application/shop.service';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
export declare class FranchiseService {
    private repo;
    private shopService;
    private prisma;
    constructor(repo: FranchiseRepository, shopService: ShopService, prisma: PrismaService);
    createFranchise(ownerId: string, data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
        logo: string | null;
        isActive: boolean;
        settings: import("@prisma/client/runtime/library").JsonValue | null;
        description: string | null;
        subscription: import("@prisma/client/runtime/library").JsonValue | null;
        contact: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    getMyFranchise(ownerId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
        logo: string | null;
        isActive: boolean;
        settings: import("@prisma/client/runtime/library").JsonValue | null;
        description: string | null;
        subscription: import("@prisma/client/runtime/library").JsonValue | null;
        contact: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    updateFranchise(ownerId: string, data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
        logo: string | null;
        isActive: boolean;
        settings: import("@prisma/client/runtime/library").JsonValue | null;
        description: string | null;
        subscription: import("@prisma/client/runtime/library").JsonValue | null;
        contact: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    addOutlet(ownerId: string, shopId: string): Promise<{
        message: string;
    }>;
    removeOutlet(ownerId: string, shopId: string): Promise<{
        message: string;
    }>;
    getOutlets(ownerId: string): Promise<any[]>;
    addManager(ownerId: string, managerVendorId: string, body: any): Promise<any>;
    removeManager(ownerId: string, managerVendorId: string): Promise<any>;
    getManagers(ownerId: string): Promise<any[]>;
    getFranchiseAnalytics(ownerId: string, duration: string): Promise<any>;
    private getOutletShopIds;
    private getReportDateRange;
    getSalesReport(ownerId: string, period?: string): Promise<{
        period: string;
        totalRevenue: number;
        totalOrders: number;
        averageOrderValue: number;
        revenueByOutlet: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.OrderGroupByOutputType, "shopId"[]> & {
            _count: number;
            _sum: {
                totalAmount: number | null;
            };
        })[];
    }>;
    getOutletComparison(ownerId: string, period?: string): Promise<{
        period: string;
        comparison: {
            shopId: string;
            shopName: string;
            revenue: number;
            orders: number;
            avgOrderValue: number;
            avgRating: number;
        }[];
    }>;
    getOrdersReport(ownerId: string, period?: string): Promise<{
        period: string;
        statusBreakdown: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.OrderGroupByOutputType, "orderStatus"[]> & {
            _count: number;
        })[];
        typeBreakdown: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.OrderGroupByOutputType, "orderType"[]> & {
            _count: number;
        })[];
        totalOrders: number;
    }>;
    getInventoryReport(ownerId: string): Promise<{
        totalItems: number;
        availableItems: number;
        unavailableItems: number;
        items: {
            id: string;
            name: string;
            _count: {
                orderItems: number;
            };
            shopId: string;
            price: number | null;
            isAvailable: boolean;
        }[];
    }>;
    getManagerReport(ownerId: string, period?: string): Promise<{
        period: string;
        managers: {
            managerId: any;
            managerName: any;
            assignedShops: any;
            performance: {
                note: string;
            };
        }[];
    }>;
    getDistributionMatrix(ownerId: string): Promise<{
        outletId: any;
        outletName: any;
        categories: ({
            menuItems: {
                id: string;
                name: string;
                isAvailable: boolean;
            }[];
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            shopId: string;
            isActive: boolean;
            nameHi: string;
            nameGu: string;
            description: string;
            descriptionHi: string;
            descriptionGu: string;
            sourceGlobalCategoryId: string | null;
            sortOrder: number;
            isArchived: boolean;
            archivedAt: Date | null;
        })[];
    }[]>;
    toggleItemForOutlet(ownerId: string, outletId: string, itemId: string, enabled: boolean): Promise<{
        message: string;
    }>;
}
