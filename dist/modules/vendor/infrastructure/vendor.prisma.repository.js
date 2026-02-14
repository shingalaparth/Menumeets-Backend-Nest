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
exports.VendorPrismaRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../infrastructure/database/prisma.service");
const hash_util_1 = require("../../../shared/utils/hash.util");
let VendorPrismaRepository = class VendorPrismaRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        return this.prisma.vendor.findUnique({ where: { id } });
    }
    async findByEmail(email) {
        return this.prisma.vendor.findUnique({ where: { email } });
    }
    async findByEmailOrPhone(email, phone) {
        return this.prisma.vendor.findFirst({
            where: { OR: [{ email }, { phone }] },
        });
    }
    async findStaffByOwner(ownerId) {
        return this.prisma.vendor.findMany({
            where: { parentVendorId: ownerId },
        });
    }
    async findAll() {
        return this.prisma.vendor.findMany({
            select: {
                id: true, name: true, email: true, phone: true, role: true,
                createdAt: true, updatedAt: true,
            },
        });
    }
    async create(data) {
        const hashed = await (0, hash_util_1.hashPassword)(data.password);
        return this.prisma.vendor.create({
            data: { ...data, password: hashed },
        });
    }
    async update(id, data) {
        if (data.password) {
            data.password = await (0, hash_util_1.hashPassword)(data.password);
        }
        return this.prisma.vendor.update({
            where: { id },
            data: data,
        });
    }
    async delete(id) {
        await this.prisma.vendor.delete({ where: { id } });
    }
    async createActivityLog(data) {
        try {
            await this.prisma.vendorActivityLog.create({ data });
        }
        catch (e) {
            console.error('Activity Log Error:', e);
        }
    }
    async findActivityLogs(vendorId, limit = 50) {
        return this.prisma.vendorActivityLog.findMany({
            where: { vendorId },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
};
exports.VendorPrismaRepository = VendorPrismaRepository;
exports.VendorPrismaRepository = VendorPrismaRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VendorPrismaRepository);
//# sourceMappingURL=vendor.prisma.repository.js.map