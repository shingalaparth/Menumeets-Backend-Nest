import { ReviewService } from '../application/review.service';
export declare class ReviewController {
    private readonly service;
    constructor(service: ReviewService);
    createReview(req: any, body: any): Promise<{
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
    getShopReviews(shopId: string, page: number): Promise<{
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
    replyToReview(req: any, id: string, reply: string): Promise<{
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
    getVendorReviews(req: any, page: number): Promise<{
        reviews: import(".prisma/client").Review[];
        total: number;
    }>;
}
