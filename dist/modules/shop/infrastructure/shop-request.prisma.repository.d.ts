import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { ShopRequestRepository } from '../domain/shop-request.repository';
export declare class ShopRequestPrismaRepository implements ShopRequestRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<any>;
    findByShopId(shopId: string): Promise<any[]>;
    findByFoodCourtId(foodCourtId: string): Promise<any[]>;
    findByFranchiseId(franchiseId: string): Promise<any[]>;
    findById(id: string): Promise<any | null>;
    update(id: string, data: any): Promise<any>;
}
