import { Notification } from '@prisma/client';
export interface NotificationRepository {
    create(data: any): Promise<Notification>;
    findById(id: string): Promise<Notification | null>;
    findByUserId(userId: string): Promise<Notification[]>;
    findByVendorId(vendorId: string): Promise<Notification[]>;
    markAsRead(id: string): Promise<Notification>;
}
export declare const NOTIFICATION_REPOSITORY = "NOTIFICATION_REPOSITORY";
