/**
 * Table Service — Application layer
 * Handles Table CRUD + Complex Session Management (Start, Close, Merge, Unmerge).
 */
import {
    Injectable,
    Inject,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
} from '@nestjs/common';
import { TABLE_REPOSITORY, TableRepository } from '../domain/table.repository';
import { ShopService } from '../../shop/application/shop.service';
// Order service will be injected later when migrated
// import { OrderService } from '../../order/application/order.service';

@Injectable()
export class TableService {
    constructor(
        @Inject(TABLE_REPOSITORY) private repo: TableRepository,
        private shopService: ShopService,
        // private orderService: OrderService
    ) { }

    // ── TABLES ──

    async createTable(shopId: string, vendor: any, body: any) {
        await this.shopService.checkOwnership(shopId, vendor);
        // Note: Food Court logic is stripped for now as we are in Shop Phase.
        // Will be re-added when Food Court module is migrated.

        return this.repo.createTable({
            tableNumber: body.tableNumber || 'General QR',
            shopId,
            screen: body.screen,
            totalRows: body.totalRows,
            seatsPerRow: body.seatsPerRow,
            totalCapacity: body.totalCapacity,
            rowConfig: body.rowConfig,
            row: body.row,
            seat: body.seat,
            type: body.type,
        });
    }

    async getTablesForShop(shopId: string, vendor: any) {
        await this.shopService.checkOwnership(shopId, vendor);
        return this.getTablesForShopInternal(shopId);
    }

    async updateTable(shopId: string, qrIdentifier: string, vendor: any, body: any) {
        await this.shopService.checkOwnership(shopId, vendor);
        const updated = await this.repo.updateTable(qrIdentifier, shopId, body);
        if (!updated) throw new NotFoundException('Table not found');
        return updated;
    }

    async deleteTable(shopId: string, qrIdentifier: string, vendor: any) {
        await this.shopService.checkOwnership(shopId, vendor);
        await this.repo.deleteTableByQr(qrIdentifier, shopId);
        return { message: 'Table deleted successfully' };
    }

    async deleteAllTables(shopId: string, vendor: any) {
        await this.shopService.checkOwnership(shopId, vendor);
        await this.repo.deleteTablesByShop(shopId); // Need to add this method to repo if missing or use loop
        return { message: 'All tables deleted successfully' };
    }

    async findTableByQr(qrIdentifier: string) {
        return this.repo.findTableByQr(qrIdentifier);
    }

    async getActiveSessions(shopId: string) {
        return this.repo.findActiveSessionsByShop(shopId);
    }

    async getSessionById(sessionId: string) {
        return this.repo.findSessionById(sessionId);
    }

    // ── SESSIONS ──

    async startSession(shopId: string, vendor: any, body: { tableId: string; customerName?: string; pax?: number }) {
        await this.shopService.checkOwnership(shopId, vendor);
        return this.startSessionInternal(shopId, body);
    }

    async closeSession(shopId: string, sessionId: string, vendor: any) {
        await this.shopService.checkOwnership(shopId, vendor);
        return this.closeSessionInternal(shopId, sessionId);
    }

    async getSessionDetails(shopId: string, sessionId: string, vendor: any) {
        await this.shopService.checkOwnership(shopId, vendor);
        const session = await this.repo.findSessionById(sessionId);
        if (!session || session.shopId !== shopId) throw new NotFoundException('Session not found');

        // Should fetch orders here too
        return { session, orders: [] };
    }

    async changeTableSession(shopId: string, vendor: any, body: { sessionId: string; newTableId: string }) {
        await this.shopService.checkOwnership(shopId, vendor);
        const isOccupied = await this.repo.findActiveSessionByTable(body.newTableId);
        if (isOccupied) throw new BadRequestException('Target table occupied');

        const session = await this.repo.findSessionById(body.sessionId);
        if (!session || session.shopId !== shopId) throw new NotFoundException('Session not found');

        // Update session table
        const updated = await this.repo.updateSession(body.sessionId, { tableId: body.newTableId } as any);

        // Should also update Orders tableId here

        return updated;
    }

    async mergeTableSession(shopId: string, vendor: any, body: { sessionId: string; tableIds: string[] }) {
        await this.shopService.checkOwnership(shopId, vendor);
        const session = await this.repo.findSessionById(body.sessionId);
        if (!session || session.shopId !== shopId) throw new NotFoundException('Session not found');

        const currentAdditional = (session.additionalTables as string[]) || [];
        const newTables = [...currentAdditional];

        for (const targetId of body.tableIds) {
            if (targetId === session.tableId || newTables.includes(targetId)) continue;

            const targetSession = await this.repo.findActiveSessionByTable(targetId);
            if (targetSession) {
                // Merge logic: Close target session, move orders (later), add table to main session
                await this.repo.updateSession(targetSession.id, { status: 'CLOSED', closedAt: new Date() });
                // Move orders logic here
            }
            newTables.push(targetId);
        }

        return this.repo.updateSession(body.sessionId, { additionalTables: newTables } as any);
    }

    async unmergeTableSession(shopId: string, vendor: any, body: { sessionId: string; tableToUnmergeId: string }) {
        await this.shopService.checkOwnership(shopId, vendor);
        const session = await this.repo.findSessionById(body.sessionId);
        if (!session || session.shopId !== shopId) throw new NotFoundException('Session not found');

        const current = (session.additionalTables as string[]) || [];
        const filtered = current.filter(id => id !== body.tableToUnmergeId);

        return this.repo.updateSession(body.sessionId, { additionalTables: filtered } as any);
    }

    // Stub for Place Order (moved from Controller)
    async placeTableOrder(shopId: string, vendor: any, body: any) {
        await this.shopService.checkOwnership(shopId, vendor);
        // This requires Order Module. 
        // Throw error strictly or return mock? returning mock for build pass, but should be impl in Phase 3.
        return { message: "Order placement logic will be enabled in Phase 3 (Order Module)" };
    }

    // ── INTERNAL METHODS (Bypass Vendor Check) ──

    async getTablesForShopInternal(shopId: string) {
        const tables = await this.repo.findTablesByShop(shopId);
        const sessions = await this.repo.findActiveSessionsByShop(shopId);
        const sessionMap = new Map();
        sessions.forEach(s => {
            sessionMap.set(s.tableId, s);
            if (s.additionalTables) {
                // @ts-ignore
                s.additionalTables.forEach((tId: string) => sessionMap.set(tId, { ...s, isMerged: true, originalTableId: s.tableId }));
            }
        });

        return tables.map(t => {
            const session = sessionMap.get(t.id);
            return {
                ...t,
                session: session || null,
                isOccupied: !!session,
                status: session ? session.status : 'AVAILABLE',
                isMerged: session?.isMerged || false,
            };
        });
    }

    async startSessionInternal(shopId: string, body: { tableId: string; customerName?: string; pax?: number }) {
        if (!body.tableId) throw new BadRequestException('Table ID required');
        const existing = await this.repo.findActiveSessionByTable(body.tableId);
        if (existing) throw new BadRequestException('Table is already occupied');

        return this.repo.createSession({
            tableId: body.tableId,
            shopId,
            customerName: body.customerName || 'Walk-in Guest',
            pax: body.pax || 1,
            managedBy: 'VENDOR', // or CAPTAIN
            sessionCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        });
    }

    async closeSessionInternal(shopId: string, sessionId: string) {
        const session = await this.repo.findSessionById(sessionId);
        if (!session || session.shopId !== shopId) throw new NotFoundException('Session not found');
        if (session.status === 'CLOSED') throw new BadRequestException('Session is already closed');

        return this.repo.updateSession(sessionId, {
            status: 'CLOSED',
            closedAt: new Date(),
        });
    }
}
