import { AdminService } from '../application/admin.service';
export declare class AdminController {
    private readonly service;
    constructor(service: AdminService);
    getStats(): Promise<any>;
    getShops(): Promise<{
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
    toggleShopStatus(id: string): Promise<{
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
    updateCommission(id: string, commission: number): Promise<{
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
    getVendors(): Promise<{
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
    impersonate(id: string): Promise<{
        message: string;
        token: string;
        vendor: {
            id: string;
            name: string;
            role: string;
        };
    }>;
    resetPassword(id: string, pass: string): Promise<{
        message: string;
    }>;
    sendBroadcast(body: any): Promise<{
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
