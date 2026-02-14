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
    addManager(franchiseId: string, vendor: any, body: {
        vendorId: string;
        regions?: string[];
        assignedShops?: string[];
        permissions?: any;
    }): Promise<any>;
    removeManager(franchiseId: string, managerVendorId: string, vendor: any): Promise<any>;
    getManagers(franchiseId: string, vendor: any): Promise<any[]>;
    getAnalytics(franchiseId: string, duration: string | undefined, vendor: any): Promise<any>;
    addOutlet(req: any, shopId: string): Promise<{
        message: string;
    }>;
    removeOutlet(req: any, shopId: string): Promise<{
        message: string;
    }>;
}
