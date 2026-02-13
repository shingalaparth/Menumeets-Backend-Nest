import { VendorService } from '../application/vendor.service';
export declare class VendorController {
    private vendorService;
    constructor(vendorService: VendorService);
    getProfile(vendor: any): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        role: string;
        parentVendorId?: string | null;
        managesFoodCourt?: string | null;
        managesShop?: string | null;
        personalInfo?: import("../domain/vendor.entity").VendorPersonalInfo | null;
        kyc?: import("../domain/vendor.entity").VendorKyc | null;
        bankDetails?: import("../domain/vendor.entity").VendorBankDetails | null;
        franchiseRoles?: any | null;
        notificationPreferences?: any | null;
        security?: any | null;
        permissions?: any | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(vendor: any, body: any, file?: Express.Multer.File): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        role: string;
        parentVendorId?: string | null;
        managesFoodCourt?: string | null;
        managesShop?: string | null;
        personalInfo?: import("../domain/vendor.entity").VendorPersonalInfo | null;
        kyc?: import("../domain/vendor.entity").VendorKyc | null;
        bankDetails?: import("../domain/vendor.entity").VendorBankDetails | null;
        franchiseRoles?: any | null;
        notificationPreferences?: any | null;
        security?: any | null;
        permissions?: any | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteProfile(vendor: any): Promise<{
        message: string;
    }>;
    logout(vendor: any, req: any): Promise<{
        message: string;
    }>;
    changePassword(vendor: any, body: {
        currentPassword: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
    updateKYC(vendor: any, body: any, files: Record<string, Express.Multer.File[]>): Promise<any>;
    updateBankDetails(vendor: any, body: any, files: Record<string, Express.Multer.File[]>): Promise<any>;
    getActivityLogs(vendor: any): Promise<import("../domain/vendor.entity").VendorActivityLogEntity[]>;
    getAllVendors(): Promise<Partial<import("../domain/vendor.entity").VendorEntity>[]>;
}
