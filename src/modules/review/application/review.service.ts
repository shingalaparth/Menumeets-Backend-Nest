import { Injectable, Inject, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { REVIEW_REPOSITORY, ReviewRepository } from '../domain/review.repository';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class ReviewService {
    constructor(
        @Inject(REVIEW_REPOSITORY) private repo: ReviewRepository,
        private prisma: PrismaService
    ) { }

    async createReview(userId: string, data: { orderId: string, rating: number, comment?: string }) {
        // 1. Check if Order exists and is completed
        const order = await this.prisma.order.findUnique({
            where: { id: data.orderId },
            include: { shop: true }
        });

        if (!order) throw new NotFoundException('Order not found');
        if (order.userId !== userId) throw new ForbiddenException('You can only review your own orders');
        if (order.orderStatus !== 'Completed') throw new BadRequestException('You can only review completed orders');

        // 2. Check if already reviewed
        const existing = await this.repo.findByOrderId(data.orderId);
        if (existing) throw new BadRequestException('Order already reviewed');

        // 3. Create Review
        return this.repo.create({
            rating: data.rating,
            comment: data.comment,
            userId,
            shopId: order.shopId,
            orderId: data.orderId,
            isHidden: false
        });
    }

    async getReviewsForShop(shopId: string, page = 1, limit = 20) {
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

    async replyToReview(vendorId: string, reviewId: string, reply: string) {
        const review = await this.prisma.review.findUnique({
            where: { id: reviewId },
            include: { shop: true }
        });

        if (!review) throw new NotFoundException('Review not found');

        // Verify vendor owns the shop
        if ((review as any).shop?.ownerId !== vendorId) {
            throw new ForbiddenException('You can only reply to reviews on your own shop');
        }

        return this.prisma.review.update({
            where: { id: reviewId },
            data: { reply }
        });
    }

    async getReviewsForVendor(vendorId: string, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        return this.repo.findByVendorId(vendorId, { skip, take: limit });
    }
}
