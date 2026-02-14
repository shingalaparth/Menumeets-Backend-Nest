import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { ShopRepository } from '../domain/shop.repository';
import { ShopEntity, CreateShopData } from '../domain/shop.entity';
export declare class ShopPrismaRepository implements ShopRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<ShopEntity | null>;
    findByOwnerId(ownerId: string): Promise<ShopEntity[]>;
    findByIds(ids: string[]): Promise<ShopEntity[]>;
    create(data: CreateShopData): Promise<ShopEntity>;
    update(id: string, data: Partial<ShopEntity>): Promise<ShopEntity>;
    delete(id: string): Promise<void>;
}
