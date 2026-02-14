/**
 * Shop Repository Interface — Domain layer
 * Abstracts data access. Infrastructure provides concrete Prisma implementation.
 */
import { ShopEntity, CreateShopData } from './shop.entity';

export const SHOP_REPOSITORY = Symbol('SHOP_REPOSITORY');

export interface ShopRepository {
    // Queries
    findById(id: string): Promise<ShopEntity | null>;
    findByOwnerId(ownerId: string): Promise<ShopEntity[]>;
    findByIds(ids: string[]): Promise<ShopEntity[]>;

    // Mutations
    create(data: CreateShopData): Promise<ShopEntity>;
    update(id: string, data: Partial<ShopEntity>): Promise<ShopEntity>;
    delete(id: string): Promise<void>;
}
