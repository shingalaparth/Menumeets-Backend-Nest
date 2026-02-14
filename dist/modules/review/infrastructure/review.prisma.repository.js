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
exports.ReviewPrismaRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../infrastructure/database/prisma.service");
let ReviewPrismaRepository = class ReviewPrismaRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.review.create({ data });
    }
    async findByShopId(shopId, options) {
        const [reviews, total] = await Promise.all([
            this.prisma.review.findMany({
                where: { shopId },
                include: { user: true },
                orderBy: { createdAt: 'desc' },
                skip: options?.skip,
                take: options?.take,
            }),
            this.prisma.review.count({ where: { shopId } })
        ]);
        return { reviews, total };
    }
    async findByVendorId(vendorId, options) {
        const shops = await this.prisma.shop.findMany({
            where: {
                OR: [
                    { ownerId: vendorId },
                ]
            },
            select: { id: true }
        });
        const shopIds = shops.map((s) => s.id);
        const [reviews, total] = await Promise.all([
            this.prisma.review.findMany({
                where: { shopId: { in: shopIds } },
                include: { user: true, shop: true },
                orderBy: { createdAt: 'desc' },
                skip: options?.skip,
                take: options?.take,
            }),
            this.prisma.review.count({ where: { shopId: { in: shopIds } } })
        ]);
        return { reviews, total };
    }
    async findByOrderId(orderId) {
        return this.prisma.review.findUnique({ where: { orderId } });
    }
    async count(shopId) {
        return this.prisma.review.count({ where: { shopId } });
    }
    async aggregateRating(shopId) {
        const aggregations = await this.prisma.review.aggregate({
            _avg: { rating: true },
            _count: { rating: true },
            where: { shopId }
        });
        return {
            averageRating: aggregations._avg.rating || 0,
            reviewCount: aggregations._count.rating || 0
        };
    }
};
exports.ReviewPrismaRepository = ReviewPrismaRepository;
exports.ReviewPrismaRepository = ReviewPrismaRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewPrismaRepository);
//# sourceMappingURL=review.prisma.repository.js.map