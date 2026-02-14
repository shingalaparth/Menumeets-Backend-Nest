import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { NotificationRepository } from '../domain/notification.repository';
import { Notification } from '@prisma/client';

@Injectable()
export class NotificationPrismaRepository implements NotificationRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: any): Promise<Notification> {
        return this.prisma.notification.create({ data });
    }

    async findById(id: string): Promise<Notification | null> {
        return this.prisma.notification.findUnique({ where: { id } });
    }

    async findByUserId(userId: string): Promise<Notification[]> {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findByVendorId(vendorId: string): Promise<Notification[]> {
        return this.prisma.notification.findMany({
            where: { vendorId },
            orderBy: { createdAt: 'desc' }
        });
    }

    async markAsRead(id: string): Promise<Notification> {
        return this.prisma.notification.update({
            where: { id },
            data: { isRead: true }
        });
    }
}
