import { PrismaService } from '../../../infrastructure/database/prisma.service';
export declare class SystemService {
    private prisma;
    constructor(prisma: PrismaService);
    getPaymentConfig(): Promise<import("@prisma/client/runtime/library").JsonValue>;
    updatePaymentConfig(vendorId: string, body: any): Promise<{
        success: boolean;
        message: string;
        data: import("@prisma/client/runtime/library").JsonValue;
    }>;
    getPublicPaymentConfig(): Promise<{
        masterSwitch: any;
        allowOfflineOrders: any;
        gateways: {
            cashfree: any;
        };
    }>;
}
