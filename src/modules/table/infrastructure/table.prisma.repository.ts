import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TableRepository } from '../domain/table.repository';
import { TableEntity, TableSessionEntity, CreateTableData, CreateTableSessionData } from '../domain/table.entity';

@Injectable()
export class TablePrismaRepository implements TableRepository {
    constructor(private prisma: PrismaService) { }

    // ── Tables ──

    async findTableById(id: string): Promise<TableEntity | null> {
        return this.prisma.table.findUnique({ where: { id } }) as unknown as TableEntity | null;
    }

    async findTableByQr(qrIdentifier: string): Promise<TableEntity | null> {
        return this.prisma.table.findUnique({ where: { qrIdentifier } }) as unknown as TableEntity | null;
    }

    async findTablesByShop(shopId: string): Promise<TableEntity[]> {
        return this.prisma.table.findMany({ where: { shopId } }) as unknown as TableEntity[];
    }

    async findTablesByFoodCourt(foodCourtId: string): Promise<TableEntity[]> {
        return this.prisma.table.findMany({ where: { foodCourtId } }) as unknown as TableEntity[];
    }

    async createTable(data: CreateTableData): Promise<TableEntity> {
        return this.prisma.table.create({ data: data as any }) as unknown as TableEntity;
    }

    async createManyTables(data: CreateTableData[]): Promise<number> {
        const result = await this.prisma.table.createMany({ data: data as any[] });
        return result.count;
    }

    async updateTable(qrIdentifier: string, shopId: string, data: Partial<TableEntity>): Promise<TableEntity | null> {
        const table = await this.prisma.table.findFirst({ where: { qrIdentifier, shopId } });
        if (!table) return null;
        return this.prisma.table.update({ where: { id: table.id }, data: data as any }) as unknown as TableEntity;
    }

    async deleteTableByQr(qrIdentifier: string, shopId: string): Promise<void> {
        const table = await this.prisma.table.findFirst({ where: { qrIdentifier, shopId } });
        if (table) await this.prisma.table.delete({ where: { id: table.id } });
    }

    async deleteTablesByShop(shopId: string): Promise<void> {
        await this.prisma.table.deleteMany({ where: { shopId } });
    }

    // ── Sessions ──

    async findSessionById(id: string): Promise<TableSessionEntity | null> {
        return this.prisma.tableSession.findUnique({ where: { id } }) as unknown as TableSessionEntity | null;
    }

    async findActiveSessionsByShop(shopId: string): Promise<TableSessionEntity[]> {
        return this.prisma.tableSession.findMany({
            where: { shopId, status: { in: ['ACTIVE', 'PAYMENT_PENDING'] } },
        }) as unknown as TableSessionEntity[];
    }

    async findActiveSessionByTable(tableId: string): Promise<TableSessionEntity | null> {
        return this.prisma.tableSession.findFirst({
            where: { tableId, status: { in: ['ACTIVE', 'PAYMENT_PENDING'] } },
        }) as unknown as TableSessionEntity | null;
    }

    async createSession(data: CreateTableSessionData): Promise<TableSessionEntity> {
        return this.prisma.tableSession.create({ data: data as any }) as unknown as TableSessionEntity;
    }

    async updateSession(id: string, data: Partial<TableSessionEntity>): Promise<TableSessionEntity> {
        return this.prisma.tableSession.update({ where: { id }, data: data as any }) as unknown as TableSessionEntity;
    }
}
