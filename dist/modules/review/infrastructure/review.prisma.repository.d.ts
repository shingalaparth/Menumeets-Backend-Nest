import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { ReviewRepository } from '../domain/review.repository';
import { Review } from '@prisma/client';
export declare class ReviewPrismaRepository implements ReviewRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<Review>;
    findByShopId(shopId: string, options?: {
        skip?: number;
        take?: number;
    }): Promise<{
        reviews: Review[];
        total: number;
    }>;
    findByVendorId(vendorId: string, options?: {
        skip?: number;
        take?: number;
    }): Promise<{
        reviews: Review[];
        total: number;
    }>;
    findByOrderId(orderId: string): Promise<Review | null>;
    count(shopId: string): Promise<number>;
    aggregateRating(shopId: string): Promise<any>;
}
