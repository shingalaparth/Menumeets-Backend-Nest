import { TableRepository } from '../domain/table.repository';
import { ShopService } from '../../shop/application/shop.service';
export declare class TableService {
    private repo;
    private shopService;
    constructor(repo: TableRepository, shopService: ShopService);
    createTable(shopId: string, vendor: any, body: any): Promise<import("../domain/table.entity").TableEntity>;
    getTablesForShop(shopId: string, vendor: any): Promise<{
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
    updateTable(shopId: string, qrIdentifier: string, vendor: any, body: any): Promise<import("../domain/table.entity").TableEntity>;
    deleteTable(shopId: string, qrIdentifier: string, vendor: any): Promise<{
        message: string;
    }>;
    deleteAllTables(shopId: string, vendor: any): Promise<{
        message: string;
    }>;
    findTableByQr(qrIdentifier: string): Promise<import("../domain/table.entity").TableEntity | null>;
    getActiveSessions(shopId: string): Promise<import("../domain/table.entity").TableSessionEntity[]>;
    getSessionById(sessionId: string): Promise<import("../domain/table.entity").TableSessionEntity | null>;
    startSession(shopId: string, vendor: any, body: {
        tableId: string;
        customerName?: string;
        pax?: number;
    }): Promise<import("../domain/table.entity").TableSessionEntity>;
    closeSession(shopId: string, sessionId: string, vendor: any): Promise<import("../domain/table.entity").TableSessionEntity>;
    getSessionDetails(shopId: string, sessionId: string, vendor: any): Promise<{
        session: import("../domain/table.entity").TableSessionEntity;
        orders: never[];
    }>;
    changeTableSession(shopId: string, vendor: any, body: {
        sessionId: string;
        newTableId: string;
    }): Promise<import("../domain/table.entity").TableSessionEntity>;
    mergeTableSession(shopId: string, vendor: any, body: {
        sessionId: string;
        tableIds: string[];
    }): Promise<import("../domain/table.entity").TableSessionEntity>;
    unmergeTableSession(shopId: string, vendor: any, body: {
        sessionId: string;
        tableToUnmergeId: string;
    }): Promise<import("../domain/table.entity").TableSessionEntity>;
    placeTableOrder(shopId: string, vendor: any, body: any): Promise<{
        message: string;
    }>;
    getTablesForShopInternal(shopId: string): Promise<{
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
    startSessionInternal(shopId: string, body: {
        tableId: string;
        customerName?: string;
        pax?: number;
    }): Promise<import("../domain/table.entity").TableSessionEntity>;
    closeSessionInternal(shopId: string, sessionId: string): Promise<import("../domain/table.entity").TableSessionEntity>;
}
