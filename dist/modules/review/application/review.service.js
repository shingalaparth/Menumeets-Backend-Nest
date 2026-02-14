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
exports.ReviewService = void 0;
const common_1 = require("@nestjs/common");
const review_repository_1 = require("../domain/review.repository");
const prisma_service_1 = require("../../../infrastructure/database/prisma.service");
let ReviewService = class ReviewService {
    constructor(repo, prisma) {
        this.repo = repo;
        this.prisma = prisma;
    }
    async createReview(userId, data) {
        const order = await this.prisma.order.findUnique({
            where: { id: data.orderId },
            include: { shop: true }
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.userId !== userId)
            throw new common_1.ForbiddenException('You can only review your own orders');
        if (order.orderStatus !== 'Completed')
            throw new common_1.BadRequestException('You can only review completed orders');
        const existing = await this.repo.findByOrderId(data.orderId);
        if (existing)
            throw new common_1.BadRequestException('Order already reviewed');
        return this.repo.create({
            rating: data.rating,
            comment: data.comment,
            userId,
            shopId: order.shopId,
            orderId: data.orderId,
            isHidden: false
        });
    }
    async getReviewsForShop(shopId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const { reviews, total } = await this.repo.findByShopId(shopId, { skip, take: limit });
        const stats = await this.repo.aggregateRating(shopId);
        return {
            reviews,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            },
            stats
        };
    }
    async getReviewsForVendor(vendorId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        return this.repo.findByVendorId(vendorId, { skip, take: limit });
    }
};
exports.ReviewService = ReviewService;
exports.ReviewService = ReviewService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(review_repository_1.REVIEW_REPOSITORY)),
    __metadata("design:paramtypes", [Object, prisma_service_1.PrismaService])
], ReviewService);
//# sourceMappingURL=review.service.js.map