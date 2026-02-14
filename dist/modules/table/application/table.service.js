"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableService = void 0;
const common_1 = require("@nestjs/common");
const table_repository_1 = require("../domain/table.repository");
const shop_service_1 = require("../../shop/application/shop.service");
let TableService = class TableService {
    constructor(repo, shopService) {
        this.repo = repo;
        this.shopService = shopService;
    }
    async createTable(shopId, vendor, body) {
        await this.shopService.checkOwnership(shopId, vendor);
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
    async getTablesForShop(shopId, vendor) {
        await this.shopService.checkOwnership(shopId, vendor);
        return this.getTablesForShopInternal(shopId);
    }
    async updateTable(shopId, qrIdentifier, vendor, body) {
        await this.shopService.checkOwnership(shopId, vendor);
        const updated = await this.repo.updateTable(qrIdentifier, shopId, body);
        if (!updated)
            throw new common_1.NotFoundException('Table not found');
        return updated;
    }
    async deleteTable(shopId, qrIdentifier, vendor) {
        await this.shopService.checkOwnership(shopId, vendor);
        await this.repo.deleteTableByQr(qrIdentifier, shopId);
        return { message: 'Table deleted successfully' };
    }
    async deleteAllTables(shopId, vendor) {
        await this.shopService.checkOwnership(shopId, vendor);
        await this.repo.deleteTablesByShop(shopId);
        return { message: 'All tables deleted successfully' };
    }
    async findTableByQr(qrIdentifier) {
        return this.repo.findTableByQr(qrIdentifier);
    }
    async getActiveSessions(shopId) {
        return this.repo.findActiveSessionsByShop(shopId);
    }
    async getSessionById(sessionId) {
        return this.repo.findSessionById(sessionId);
    }
    async startSession(shopId, vendor, body) {
        await this.shopService.checkOwnership(shopId, vendor);
        return this.startSessionInternal(shopId, body);
    }
    async closeSession(shopId, sessionId, vendor) {
        await this.shopService.checkOwnership(shopId, vendor);
        return this.closeSessionInternal(shopId, sessionId);
    }
    async getSessionDetails(shopId, sessionId, vendor) {
        await this.shopService.checkOwnership(shopId, vendor);
        const session = await this.repo.findSessionById(sessionId);
        if (!session || session.shopId !== shopId)
            throw new common_1.NotFoundException('Session not found');
        return { session, orders: [] };
    }
    async getClosedSessions(shopId, page = 1, limit = 20) {
        return this.repo.findClosedSessionsByShopIdPaginated(shopId, page, limit);
    }
    async changeTableSession(shopId, vendor, body) {
        await this.shopService.checkOwnership(shopId, vendor);
        const isOccupied = await this.repo.findActiveSessionByTable(body.newTableId);
        if (isOccupied)
            throw new common_1.BadRequestException('Target table occupied');
        const session = await this.repo.findSessionById(body.sessionId);
        if (!session || session.shopId !== shopId)
            throw new common_1.NotFoundException('Session not found');
        const updated = await this.repo.updateSession(body.sessionId, { tableId: body.newTableId });
        return updated;
    }
    async mergeTableSession(shopId, vendor, body) {
        await this.shopService.checkOwnership(shopId, vendor);
        const session = await this.repo.findSessionById(body.sessionId);
        if (!session || session.shopId !== shopId)
            throw new common_1.NotFoundException('Session not found');
        const currentAdditional = session.additionalTables || [];
        const newTables = [...currentAdditional];
        for (const targetId of body.tableIds) {
            if (targetId === session.tableId || newTables.includes(targetId))
                continue;
            const targetSession = await this.repo.findActiveSessionByTable(targetId);
            if (targetSession) {
                await this.repo.updateSession(targetSession.id, { status: 'CLOSED', closedAt: new Date() });
            }
            newTables.push(targetId);
        }
        return this.repo.updateSession(body.sessionId, { additionalTables: newTables });
    }
    async unmergeTableSession(shopId, vendor, body) {
        await this.shopService.checkOwnership(shopId, vendor);
        const session = await this.repo.findSessionById(body.sessionId);
        if (!session || session.shopId !== shopId)
            throw new common_1.NotFoundException('Session not found');
        const current = session.additionalTables || [];
        const filtered = current.filter(id => id !== body.tableToUnmergeId);
        return this.repo.updateSession(body.sessionId, { additionalTables: filtered });
    }
    async placeTableOrder(shopId, vendor, body) {
        await this.shopService.checkOwnership(shopId, vendor);
        return { message: "Order placement logic will be enabled in Phase 3 (Order Module)" };
    }
    async getTablesForShopInternal(shopId) {
        const tables = await this.repo.findTablesByShop(shopId);
        const sessions = await this.repo.findActiveSessionsByShop(shopId);
        const sessionMap = new Map();
        sessions.forEach(s => {
            sessionMap.set(s.tableId, s);
            if (s.additionalTables) {
                s.additionalTables.forEach((tId) => sessionMap.set(tId, { ...s, isMerged: true, originalTableId: s.tableId }));
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
    async startSessionInternal(shopId, body) {
        if (!body.tableId)
            throw new common_1.BadRequestException('Table ID required');
        const existing = await this.repo.findActiveSessionByTable(body.tableId);
        if (existing)
            throw new common_1.BadRequestException('Table is already occupied');
        return this.repo.createSession({
            tableId: body.tableId,
            shopId,
            customerName: body.customerName || 'Walk-in Guest',
            pax: body.pax || 1,
            managedBy: 'VENDOR',
            sessionCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        });
    }
    async closeSessionInternal(shopId, sessionId) {
        const session = await this.repo.findSessionById(sessionId);
        if (!session || session.shopId !== shopId)
            throw new common_1.NotFoundException('Session not found');
        if (session.status === 'CLOSED')
            throw new common_1.BadRequestException('Session is already closed');
        return this.repo.updateSession(sessionId, {
            status: 'CLOSED',
            closedAt: new Date(),
        });
    }
};
exports.TableService = TableService;
exports.TableService = TableService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(table_repository_1.TABLE_REPOSITORY)),
    __metadata("design:paramtypes", [Object, shop_service_1.ShopService])
], TableService);
//# sourceMappingURL=table.service.js.map