import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { FranchiseRepository } from '../domain/franchise.repository';
import { Franchise } from '@prisma/client';
export declare class FranchisePrismaRepository implements FranchiseRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<Franchise>;
    findById(id: string): Promise<Franchise | null>;
    findByOwnerId(ownerId: string): Promise<Franchise | null>;
    update(id: string, data: any): Promise<Franchise>;
    addShop(franchiseId: string, shopId: string): Promise<void>;
    removeShop(franchiseId: string, shopId: string): Promise<void>;
    getOutlets(franchiseId: string): Promise<any[]>;
    addManager(franchiseId: string, vendorId: string, body: any): Promise<any>;
    removeManager(franchiseId: string, vendorId: string): Promise<any>;
    getManagers(franchiseId: string): Promise<any[]>;
    getAnalytics(franchiseId: string, duration: string): Promise<any>;
}
