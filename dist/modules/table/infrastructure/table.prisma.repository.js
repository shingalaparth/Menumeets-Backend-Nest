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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TablePrismaRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../infrastructure/database/prisma.service");
let TablePrismaRepository = class TablePrismaRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findTableById(id) {
        return this.prisma.table.findUnique({ where: { id } });
    }
    async findTableByQr(qrIdentifier) {
        return this.prisma.table.findUnique({ where: { qrIdentifier } });
    }
    async findTablesByShop(shopId) {
        return this.prisma.table.findMany({ where: { shopId } });
    }
    async findTablesByFoodCourt(foodCourtId) {
        return this.prisma.table.findMany({ where: { foodCourtId } });
    }
    async createTable(data) {
        return this.prisma.table.create({ data: data });
    }
    async createManyTables(data) {
        const result = await this.prisma.table.createMany({ data: data });
        return result.count;
    }
    async updateTable(qrIdentifier, shopId, data) {
        const table = await this.prisma.table.findFirst({ where: { qrIdentifier, shopId } });
        if (!table)
            return null;
        return this.prisma.table.update({ where: { id: table.id }, data: data });
    }
    async deleteTableByQr(qrIdentifier, shopId) {
        const table = await this.prisma.table.findFirst({ where: { qrIdentifier, shopId } });
        if (table)
            await this.prisma.table.delete({ where: { id: table.id } });
    }
    async deleteTablesByShop(shopId) {
        await this.prisma.table.deleteMany({ where: { shopId } });
    }
    async findSessionById(id) {
        return this.prisma.tableSession.findUnique({ where: { id } });
    }
    async findActiveSessionsByShop(shopId) {
        return this.prisma.tableSession.findMany({
            where: { shopId, status: { in: ['ACTIVE', 'PAYMENT_PENDING'] } },
        });
    }
    async findActiveSessionByTable(tableId) {
        return this.prisma.tableSession.findFirst({
            where: { tableId, status: { in: ['ACTIVE', 'PAYMENT_PENDING'] } },
        });
    }
    async createSession(data) {
        return this.prisma.tableSession.create({ data: data });
    }
    async updateSession(id, data) {
        return this.prisma.tableSession.update({ where: { id }, data: data });
    }
    async findClosedSessionsByShopIdPaginated(shopId, page, limit) {
        const skip = (page - 1) * limit;
        const [sessions, total] = await Promise.all([
            this.prisma.tableSession.findMany({
                where: { shopId, status: 'CLOSED' },
                orderBy: { closedAt: 'desc' },
                skip,
                take: limit,
                include: { table: true }
            }),
            this.prisma.tableSession.count({ where: { shopId, status: 'CLOSED' } })
        ]);
        return { sessions: sessions, total };
    }
};
exports.TablePrismaRepository = TablePrismaRepository;
exports.TablePrismaRepository = TablePrismaRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TablePrismaRepository);
//# sourceMappingURL=table.prisma.repository.js.map