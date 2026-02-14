import { NotificationRepository } from '../domain/notification.repository';
import { NotificationGateway } from './notification.gateway';
export declare class NotificationService {
    private repo;
    private gateway;
    constructor(repo: NotificationRepository, gateway: NotificationGateway);
    sendNotification(data: {
        userId?: string;
        vendorId?: string;
        title: string;
        body: string;
        type?: string;
        metadata?: any;
    }): Promise<{
        type: string;
        id: string;
        createdAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        vendorId: string | null;
        userId: string | null;
        title: string;
        body: string;
        isRead: boolean;
    }>;
    getUserNotifications(userId: string): Promise<{
        type: string;
        id: string;
        createdAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        vendorId: string | null;
        userId: string | null;
        title: string;
        body: string;
        isRead: boolean;
    }[]>;
    getVendorNotifications(vendorId: string): Promise<{
        type: string;
        id: string;
        createdAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        vendorId: string | null;
        userId: string | null;
        title: string;
        body: string;
        isRead: boolean;
    }[]>;
    markAsRead(id: string): Promise<{
        type: string;
        id: string;
        createdAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        vendorId: string | null;
        userId: string | null;
        title: string;
        body: string;
        isRead: boolean;
    }>;
}
