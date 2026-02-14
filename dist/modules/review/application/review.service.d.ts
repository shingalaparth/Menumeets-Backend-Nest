import { ReviewRepository } from '../domain/review.repository';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
export declare class ReviewService {
    private repo;
    private prisma;
    constructor(repo: ReviewRepository, prisma: PrismaService);
    createReview(userId: string, data: {
        orderId: string;
        rating: number;
        comment?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        shopId: string;
        userId: string;
        orderId: string;
        rating: number;
        comment: string | null;
        reply: string | null;
        isHidden: boolean;
    }>;
    getReviewsForShop(shopId: string, page?: number, limit?: number): Promise<{
        reviews: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            shopId: string;
            userId: string;
            orderId: string;
            rating: number;
            comment: string | null;
            reply: string | null;
            isHidden: boolean;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        stats: any;
    }>;
    getReviewsForVendor(vendorId: string, page?: number, limit?: number): Promise<{
        reviews: import(".prisma/client").Review[];
        total: number;
    }>;
}
