import { NotificationService } from '../application/notification.service';
export declare class NotificationController {
    private readonly service;
    constructor(service: NotificationService);
    getMyNotifications(req: any): Promise<{
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
