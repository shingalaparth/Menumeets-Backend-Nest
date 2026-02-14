import { FranchiseService } from '../application/franchise.service';
export declare class FranchiseController {
    private readonly franchiseService;
    constructor(franchiseService: FranchiseService);
    createFranchise(req: any, body: any): Promise<{
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
    getMyFranchise(req: any): Promise<{
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
    updateFranchise(req: any, body: any): Promise<{
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
    getOutlets(req: any): Promise<any[]>;
    addOutlet(req: any, shopId: string): Promise<{
        message: string;
    }>;
    removeOutlet(req: any, shopId: string): Promise<{
        message: string;
    }>;
    addManager(franchiseId: string, vendor: any, body: {
        vendorId: string;
        regions?: string[];
        assignedShops?: string[];
        permissions?: any;
    }): Promise<any>;
    removeManager(franchiseId: string, managerVendorId: string, vendor: any): Promise<any>;
    getManagers(franchiseId: string, vendor: any): Promise<any[]>;
    getAnalytics(franchiseId: string, duration: string | undefined, vendor: any): Promise<any>;
    getSalesReport(req: any, period: string): Promise<{
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
    getOutletComparison(req: any, period: string): Promise<{
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
    getOrdersReport(req: any, period: string): Promise<{
        period: string;
        statusBreakdown: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.OrderGroupByOutputType, "orderStatus"[]> & {
            _count: number;
        })[];
        typeBreakdown: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.OrderGroupByOutputType, "orderType"[]> & {
            _count: number;
        })[];
        totalOrders: number;
    }>;
    getInventoryReport(req: any): Promise<{
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
    getManagerReport(req: any, period: string): Promise<{
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
    getDistributionMatrix(req: any): Promise<{
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
    toggleItemForOutlet(req: any, outletId: string, itemId: string, enabled: boolean): Promise<{
        message: string;
    }>;
}
