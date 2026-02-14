import { Franchise } from '@prisma/client';

export interface FranchiseRepository {
    create(data: any): Promise<Franchise>;
    findById(id: string): Promise<Franchise | null>;
    findByOwnerId(ownerId: string): Promise<Franchise | null>;
    update(id: string, data: any): Promise<Franchise>;
    addShop(franchiseId: string, shopId: string): Promise<void>;
    removeShop(franchiseId: string, shopId: string): Promise<void>;
    getOutlets(franchiseId: string): Promise<any[]>;

    // Managers
    addManager(franchiseId: string, vendorId: string, body: any): Promise<any>;
    removeManager(franchiseId: string, vendorId: string): Promise<any>;
    getManagers(franchiseId: string): Promise<any[]>;

    // Analytics
    getAnalytics(franchiseId: string, duration: string): Promise<any>;
}

export const FRANCHISE_REPOSITORY = 'FRANCHISE_REPOSITORY';
