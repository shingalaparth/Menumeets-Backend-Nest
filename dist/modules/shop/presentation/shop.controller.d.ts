import { ShopService } from '../application/shop.service';
export declare class ShopController {
    private shopService;
    constructor(shopService: ShopService);
    createShop(vendor: any, body: {
        name: string;
        address?: string;
        phone?: string;
        businessType?: string;
    }): Promise<import("../domain/shop.entity").ShopEntity>;
    getMyShops(vendor: any): Promise<import("../domain/shop.entity").ShopEntity[]>;
    updateShop(shopId: string, vendor: any, body: any, files: Record<string, Express.Multer.File[]>): Promise<import("../domain/shop.entity").ShopEntity>;
    deleteShop(shopId: string, vendor: any): Promise<{
        message: string;
    }>;
    uploadUpiQrCode(shopId: string, vendor: any, file: Express.Multer.File): Promise<{
        upiQrCodeUrl: string;
    }>;
    applyToFoodCourt(shopId: string, vendor: any, body: {
        foodCourtId: string;
    }): Promise<{
        message: string;
        status: string;
        requestId: any;
    }>;
}
