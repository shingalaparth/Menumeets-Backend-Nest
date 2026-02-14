import { CloudinaryService } from '../../../infrastructure/external/cloudinary.service';
import { ShopRepository } from '../domain/shop.repository';
import { ShopRequestRepository } from '../domain/shop-request.repository';
import { ShopEntity } from '../domain/shop.entity';
export declare class ShopService {
    private shopRepo;
    private requestRepo;
    private cloudinary;
    constructor(shopRepo: ShopRepository, requestRepo: ShopRequestRepository, cloudinary: CloudinaryService);
    checkOwnership(shopId: string, vendor: any): Promise<ShopEntity>;
    createShop(vendorId: string, data: {
        name: string;
        address?: string;
        phone?: string;
        businessType?: string;
    }): Promise<ShopEntity>;
    getMyShops(vendor: any): Promise<ShopEntity[]>;
    deleteShop(shopId: string, vendor: any): Promise<{
        message: string;
    }>;
    updateShop(shopId: string, vendor: any, updates: any, files?: Record<string, Express.Multer.File[]>): Promise<ShopEntity>;
    uploadUpiQrCode(shopId: string, vendor: any, file: Express.Multer.File): Promise<{
        upiQrCodeUrl: string;
    }>;
    findById(id: string): Promise<ShopEntity | null>;
    getShopById(id: string): Promise<ShopEntity | null>;
    applyToFoodCourt(vendorId: string, shopId: string, foodCourtId: string): Promise<{
        message: string;
        status: string;
        requestId: any;
    }>;
}
