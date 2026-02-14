import { CaptainService } from '../application/captain.service';
export declare class CaptainController {
    private readonly captainService;
    constructor(captainService: CaptainService);
    login(body: any): Promise<{
        success: boolean;
        token: string;
        shop: {
            id: string;
            name: string;
            features: any;
            settings: import("../../shop/domain/shop.entity").ShopSettings | null | undefined;
        };
    }>;
    getDashboard(shop: any): Promise<{
        tables: {
            session: any;
            isOccupied: boolean;
            status: any;
            isMerged: any;
            id: string;
            tableNumber: string;
            section?: string | null;
            type?: string | null;
            screen?: string | null;
            totalRows?: number | null;
            seatsPerRow?: number | null;
            totalCapacity?: number | null;
            rowConfig?: any;
            row?: string | null;
            seat?: string | null;
            shopId?: string | null;
            foodCourtId?: string | null;
            qrIdentifier: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        activeSessions: {
            totalAmount: number;
            id: string;
            tableId: string;
            shopId: string;
            additionalTables?: string[] | null;
            status: "ACTIVE" | "PAYMENT_PENDING" | "CLOSED";
            sessionCode: string;
            customerName: string;
            pax: number;
            managedBy: "VENDOR" | "CUSTOMER";
            openedAt: Date;
            closedAt?: Date | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    startSession(shop: any, body: any): Promise<import("../../table/domain/table.entity").TableSessionEntity>;
    closeSession(shop: any, body: any): Promise<{
        message: string;
        invoice: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            items: import("@prisma/client/runtime/library").JsonValue;
            userId: string | null;
            subtotal: number;
            orderId: string | null;
            invoiceNumber: string;
            taxAmount: number;
            grandTotal: number;
        } | null;
    }>;
}
