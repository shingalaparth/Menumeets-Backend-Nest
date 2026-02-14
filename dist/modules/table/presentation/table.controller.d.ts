import { TableService } from '../application/table.service';
export declare class TableController {
    private tableService;
    constructor(tableService: TableService);
    createTable(shopId: string, vendor: any, body: any): Promise<import("../domain/table.entity").TableEntity>;
    getTables(shopId: string, vendor: any): Promise<{
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
    }[]>;
    deleteAllTables(shopId: string, vendor: any): Promise<{
        message: string;
    }>;
    updateTable(shopId: string, qr: string, vendor: any, body: any): Promise<import("../domain/table.entity").TableEntity>;
    deleteTable(shopId: string, qr: string, vendor: any): Promise<{
        message: string;
    }>;
    startSession(shopId: string, vendor: any, body: any): Promise<import("../domain/table.entity").TableSessionEntity>;
    closeSession(shopId: string, sessionId: string, vendor: any): Promise<import("../domain/table.entity").TableSessionEntity>;
    getSession(shopId: string, sessionId: string, vendor: any): Promise<{
        session: import("../domain/table.entity").TableSessionEntity;
        orders: never[];
    }>;
    changeSession(shopId: string, vendor: any, body: any): Promise<import("../domain/table.entity").TableSessionEntity>;
    mergeSession(shopId: string, vendor: any, body: any): Promise<import("../domain/table.entity").TableSessionEntity>;
    unmergeSession(shopId: string, vendor: any, body: any): Promise<import("../domain/table.entity").TableSessionEntity>;
    placeOrder(shopId: string, vendor: any, body: any): Promise<{
        message: string;
    }>;
}
