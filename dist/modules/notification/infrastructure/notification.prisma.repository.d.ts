import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { NotificationRepository } from '../domain/notification.repository';
import { Notification } from '@prisma/client';
export declare class NotificationPrismaRepository implements NotificationRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<Notification>;
    findById(id: string): Promise<Notification | null>;
    findByUserId(userId: string): Promise<Notification[]>;
    findByVendorId(vendorId: string): Promise<Notification[]>;
    markAsRead(id: string): Promise<Notification>;
}
