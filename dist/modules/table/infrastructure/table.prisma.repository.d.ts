import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TableRepository } from '../domain/table.repository';
import { TableEntity, TableSessionEntity, CreateTableData, CreateTableSessionData } from '../domain/table.entity';
export declare class TablePrismaRepository implements TableRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findTableById(id: string): Promise<TableEntity | null>;
    findTableByQr(qrIdentifier: string): Promise<TableEntity | null>;
    findTablesByShop(shopId: string): Promise<TableEntity[]>;
    findTablesByFoodCourt(foodCourtId: string): Promise<TableEntity[]>;
    createTable(data: CreateTableData): Promise<TableEntity>;
    createManyTables(data: CreateTableData[]): Promise<number>;
    updateTable(qrIdentifier: string, shopId: string, data: Partial<TableEntity>): Promise<TableEntity | null>;
    deleteTableByQr(qrIdentifier: string, shopId: string): Promise<void>;
    deleteTablesByShop(shopId: string): Promise<void>;
    findSessionById(id: string): Promise<TableSessionEntity | null>;
    findActiveSessionsByShop(shopId: string): Promise<TableSessionEntity[]>;
    findActiveSessionByTable(tableId: string): Promise<TableSessionEntity | null>;
    createSession(data: CreateTableSessionData): Promise<TableSessionEntity>;
    updateSession(id: string, data: Partial<TableSessionEntity>): Promise<TableSessionEntity>;
    findClosedSessionsByShopIdPaginated(shopId: string, page: number, limit: number): Promise<{
        sessions: TableSessionEntity[];
        total: number;
    }>;
}
