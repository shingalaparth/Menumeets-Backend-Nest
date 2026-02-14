import { Injectable, Inject } from '@nestjs/common';
import { NOTIFICATION_REPOSITORY, NotificationRepository } from '../domain/notification.repository';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
    constructor(
        @Inject(NOTIFICATION_REPOSITORY) private repo: NotificationRepository,
        private gateway: NotificationGateway
    ) { }

    async sendNotification(data: { userId?: string, vendorId?: string, title: string, body: string, type?: string, metadata?: any }) {
        const notification = await this.repo.create({
            userId: data.userId,
            vendorId: data.vendorId,
            title: data.title,
            body: data.body,
            type: data.type || 'INFO',
            metadata: data.metadata,
            isRead: false
        });

        // Real-time broadcast
        if (data.userId) {
            this.gateway.sendToUser(data.userId, 'notification', notification);
        }
        if (data.vendorId) {
            this.gateway.sendToUser(data.vendorId, 'notification', notification);
        }

        return notification;
    }

    async getUserNotifications(userId: string) {
        return this.repo.findByUserId(userId);
    }

    async getVendorNotifications(vendorId: string) {
        return this.repo.findByVendorId(vendorId);
    }

    async markAsRead(id: string) {
        // TODO: Verify ownership before marking read (omitted for brevity in this step)
        return this.repo.markAsRead(id);
    }
}
