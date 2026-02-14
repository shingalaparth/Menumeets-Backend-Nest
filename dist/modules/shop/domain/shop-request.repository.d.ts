export interface ShopRequestRepository {
    create(data: any): Promise<any>;
    findByShopId(shopId: string): Promise<any[]>;
    findByFoodCourtId(foodCourtId: string): Promise<any[]>;
    findByFranchiseId(franchiseId: string): Promise<any[]>;
    findById(id: string): Promise<any | null>;
    update(id: string, data: any): Promise<any>;
}
export declare const SHOP_REQUEST_REPOSITORY = "SHOP_REQUEST_REPOSITORY";
