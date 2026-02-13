import { CloudinaryService } from '../../../infrastructure/external/cloudinary.service';
import { VendorRepository } from '../domain/vendor.repository';
export declare class VendorService {
    private vendorRepo;
    private cloudinary;
    constructor(vendorRepo: VendorRepository, cloudinary: CloudinaryService);
    getProfile(vendorId: string): Promise<{
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
    updateProfile(vendorId: string, updates: any, avatarFile?: Express.Multer.File): Promise<{
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
    deleteVendor(vendorId: string): Promise<{
        message: string;
    }>;
    updateKYC(vendorId: string, updates: any, files: Record<string, Express.Multer.File[]>): Promise<any>;
    updateBankDetails(vendorId: string, updates: any, files: Record<string, Express.Multer.File[]>): Promise<any>;
    changePassword(vendorId: string, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    getActivityLogs(vendorId: string): Promise<import("../domain/vendor.entity").VendorActivityLogEntity[]>;
    logActivity(vendorId: string, action: string, details?: string, ip?: string, device?: string): Promise<void>;
    findByEmail(email: string): Promise<import("../domain/vendor.entity").VendorEntity | null>;
    findByEmailOrPhone(email: string, phone: string): Promise<import("../domain/vendor.entity").VendorEntity | null>;
    create(data: {
        name: string;
        email: string;
        phone: string;
        password: string;
    }): Promise<import("../domain/vendor.entity").VendorEntity>;
    findAll(): Promise<Partial<import("../domain/vendor.entity").VendorEntity>[]>;
}
