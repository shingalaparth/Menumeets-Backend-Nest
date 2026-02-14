import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { ReviewRepository } from '../domain/review.repository';
import { Review } from '@prisma/client';

@Injectable()
export class ReviewPrismaRepository implements ReviewRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: any): Promise<Review> {
        return this.prisma.review.create({ data });
    }

    async findByShopId(shopId: string, options?: { skip?: number; take?: number }): Promise<{ reviews: Review[], total: number }> {
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

    async findByVendorId(vendorId: string, options?: { skip?: number; take?: number }): Promise<{ reviews: Review[], total: number }> {
        // Find all shops owned by vendor or managed by vendor
        const shops = await this.prisma.shop.findMany({
            where: {
                OR: [
                    { ownerId: vendorId },
                    // { managers: { some: { id: vendorId } } } // If we had managers relation
                ]
            },
            select: { id: true }
        });

        const shopIds = shops.map((s: { id: string }) => s.id);

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

    async findByOrderId(orderId: string): Promise<Review | null> {
        return this.prisma.review.findUnique({ where: { orderId } });
    }

    async count(shopId: string): Promise<number> {
        return this.prisma.review.count({ where: { shopId } });
    }

    async aggregateRating(shopId: string): Promise<any> {
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
}
