import { JwtService } from '@nestjs/jwt';
import { ShopService } from '../../shop/application/shop.service';
import { OrderService } from '../../order/application/order.service';
import { TableService } from '../../table/application/table.service';
import { InvoiceService } from '../../invoice/application/invoice.service';
export declare class CaptainService {
    private shopService;
    private orderService;
    private tableService;
    private jwtService;
    private invoiceService;
    constructor(shopService: ShopService, orderService: OrderService, tableService: TableService, jwtService: JwtService, invoiceService: InvoiceService);
    login(shopId: string, pin: string): Promise<{
        success: boolean;
        token: string;
        shop: {
            id: string;
            name: string;
            features: any;
            settings: import("../../shop/domain/shop.entity").ShopSettings | null | undefined;
        };
    }>;
    getDashboard(shopId: string): Promise<{
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
    startSession(shopId: string, data: any): Promise<import("../../table/domain/table.entity").TableSessionEntity>;
    closeSession(shopId: string, sessionId: string, paymentMethod: string): Promise<{
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
