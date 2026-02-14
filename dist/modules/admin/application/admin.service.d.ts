import { AdminRepository } from '../domain/admin.repository';
import { JwtService } from '@nestjs/jwt';
export declare class AdminService {
    private readonly repo;
    private jwtService;
    constructor(repo: AdminRepository, jwtService: JwtService);
    getDashboardStats(): Promise<any>;
    getAllShops(): Promise<{
        count: number;
        data: {
            id: string;
            phone: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            ownerId: string;
            address: string;
            businessType: string;
            isActive: boolean;
            status: string;
            franchiseId: string | null;
            foodCourtId: string | null;
            region: string | null;
            captainPin: string | null;
            kotPin: string | null;
            upiQrCodeUrl: string | null;
            cashfreeVendorId: string | null;
            cashfreeOnboardingStatus: string;
            settings: import("@prisma/client/runtime/library").JsonValue | null;
            franchisePolicy: import("@prisma/client/runtime/library").JsonValue | null;
            soundPreferences: import("@prisma/client/runtime/library").JsonValue | null;
            franchiseMenuDistribution: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
    }>;
    updateShopStatus(shopId: string): Promise<{
        id: string;
        phone: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
        address: string;
        businessType: string;
        isActive: boolean;
        status: string;
        franchiseId: string | null;
        foodCourtId: string | null;
        region: string | null;
        captainPin: string | null;
        kotPin: string | null;
        upiQrCodeUrl: string | null;
        cashfreeVendorId: string | null;
        cashfreeOnboardingStatus: string;
        settings: import("@prisma/client/runtime/library").JsonValue | null;
        franchisePolicy: import("@prisma/client/runtime/library").JsonValue | null;
        soundPreferences: import("@prisma/client/runtime/library").JsonValue | null;
        franchiseMenuDistribution: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    updateShopCommission(shopId: string, commission: number): Promise<{
        id: string;
        phone: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
        address: string;
        businessType: string;
        isActive: boolean;
        status: string;
        franchiseId: string | null;
        foodCourtId: string | null;
        region: string | null;
        captainPin: string | null;
        kotPin: string | null;
        upiQrCodeUrl: string | null;
        cashfreeVendorId: string | null;
        cashfreeOnboardingStatus: string;
        settings: import("@prisma/client/runtime/library").JsonValue | null;
        franchisePolicy: import("@prisma/client/runtime/library").JsonValue | null;
        soundPreferences: import("@prisma/client/runtime/library").JsonValue | null;
        franchiseMenuDistribution: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    getAllVendors(): Promise<{
        count: number;
        data: {
            id: string;
            role: string;
            phone: string;
            name: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            password: string;
            parentVendorId: string | null;
            managesFoodCourt: string | null;
            managesShop: string | null;
            personalInfo: import("@prisma/client/runtime/library").JsonValue | null;
            kyc: import("@prisma/client/runtime/library").JsonValue | null;
            bankDetails: import("@prisma/client/runtime/library").JsonValue | null;
            franchiseRoles: import("@prisma/client/runtime/library").JsonValue | null;
            notificationPreferences: import("@prisma/client/runtime/library").JsonValue | null;
            security: import("@prisma/client/runtime/library").JsonValue | null;
            permissions: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
    }>;
    impersonateVendor(vendorId: string): Promise<{
        message: string;
        token: string;
        vendor: {
            id: string;
            name: string;
            role: string;
        };
    }>;
    resetVendorPassword(vendorId: string, newPass: string): Promise<{
        message: string;
    }>;
    sendBroadcast(title: string, message: string, recipientId?: string): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        recipientId: string | null;
        readBy: string[];
    }>;
    getBroadcasts(): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        recipientId: string | null;
        readBy: string[];
    }[]>;
}
