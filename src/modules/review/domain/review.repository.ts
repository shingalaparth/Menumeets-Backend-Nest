import { Review } from '@prisma/client';

export interface ReviewRepository {
    create(data: any): Promise<Review>;
    findByShopId(shopId: string, options?: any): Promise<{ reviews: Review[], total: number }>;
    findByVendorId(vendorId: string, options?: any): Promise<{ reviews: Review[], total: number }>;
    findByOrderId(orderId: string): Promise<Review | null>;
    count(shopId: string): Promise<number>;
    aggregateRating(shopId: string): Promise<any>;
}

export const REVIEW_REPOSITORY = 'REVIEW_REPOSITORY';
