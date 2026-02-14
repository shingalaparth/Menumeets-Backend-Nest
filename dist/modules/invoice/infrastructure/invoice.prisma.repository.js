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
exports.InvoicePrismaRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../infrastructure/database/prisma.service");
let InvoicePrismaRepository = class InvoicePrismaRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.invoice.create({ data });
    }
    async findById(id) {
        return this.prisma.invoice.findUnique({
            where: { id },
            include: { order: { include: { shop: true, items: true } }, user: true }
        });
    }
    async findByOrderId(orderId) {
        return this.prisma.invoice.findFirst({
            where: { orderId },
            include: { order: { include: { shop: true, items: true } }, user: true }
        });
    }
    async findByInvoiceNumber(invoiceNumber) {
        return this.prisma.invoice.findUnique({
            where: { invoiceNumber },
            include: { order: { include: { shop: true, items: true } }, user: true }
        });
    }
    async count() {
        return this.prisma.invoice.count();
    }
    async findByShopId(shopId, page, limit) {
        const where = {
            order: { shopId }
        };
        const [invoices, total] = await Promise.all([
            this.prisma.invoice.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                include: { order: { include: { items: true } }, user: true }
            }),
            this.prisma.invoice.count({ where })
        ]);
        return { invoices, total };
    }
    async findByUserId(userId) {
        return this.prisma.invoice.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: { order: { include: { shop: true, items: true } } }
        });
    }
    async updateStatus(id, status) {
        return this.prisma.invoice.update({
            where: { id },
            data: { status }
        });
    }
};
exports.InvoicePrismaRepository = InvoicePrismaRepository;
exports.InvoicePrismaRepository = InvoicePrismaRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InvoicePrismaRepository);
//# sourceMappingURL=invoice.prisma.repository.js.map