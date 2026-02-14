import { SystemService } from '../application/system.service';
export declare class SystemController {
    private readonly service;
    constructor(service: SystemService);
    getPaymentConfig(): Promise<import("@prisma/client/runtime/library").JsonValue>;
    updatePaymentConfig(user: any, body: any): Promise<{
        success: boolean;
        message: string;
        data: import("@prisma/client/runtime/library").JsonValue;
    }>;
    getPublicPaymentConfig(): Promise<{
        success: boolean;
        data: {
            masterSwitch: any;
            allowOfflineOrders: any;
            gateways: {
                cashfree: any;
            };
        };
    }>;
}
