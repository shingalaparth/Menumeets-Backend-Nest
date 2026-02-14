import { FranchiseRepository } from '../domain/franchise.repository';
import { ShopService } from '../../shop/application/shop.service';
export declare class FranchiseService {
    private repo;
    private shopService;
    constructor(repo: FranchiseRepository, shopService: ShopService);
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
}
