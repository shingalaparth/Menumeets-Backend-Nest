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
exports.ShopPrismaRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../infrastructure/database/prisma.service");
let ShopPrismaRepository = class ShopPrismaRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        return this.prisma.shop.findUnique({ where: { id } });
    }
    async findByOwnerId(ownerId) {
        return this.prisma.shop.findMany({ where: { ownerId } });
    }
    async findByIds(ids) {
        return this.prisma.shop.findMany({
            where: { id: { in: ids } },
        });
    }
    async create(data) {
        return this.prisma.shop.create({ data });
    }
    async update(id, data) {
        return this.prisma.shop.update({
            where: { id },
            data: data,
        });
    }
    async delete(id) {
        await this.prisma.shop.delete({ where: { id } });
    }
};
exports.ShopPrismaRepository = ShopPrismaRepository;
exports.ShopPrismaRepository = ShopPrismaRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ShopPrismaRepository);
//# sourceMappingURL=shop.prisma.repository.js.map