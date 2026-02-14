import { ShopEntity, CreateShopData } from './shop.entity';
export declare const SHOP_REPOSITORY: unique symbol;
export interface ShopRepository {
    findById(id: string): Promise<ShopEntity | null>;
    findByOwnerId(ownerId: string): Promise<ShopEntity[]>;
    findByIds(ids: string[]): Promise<ShopEntity[]>;
    create(data: CreateShopData): Promise<ShopEntity>;
    update(id: string, data: Partial<ShopEntity>): Promise<ShopEntity>;
    delete(id: string): Promise<void>;
}
