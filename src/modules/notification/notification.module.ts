import { Module } from '@nestjs/common';
import { NotificationController } from './presentation/notification.controller';
import { NotificationService } from './application/notification.service';
import { NotificationGateway } from './application/notification.gateway';
import { NOTIFICATION_REPOSITORY } from './domain/notification.repository';
import { NotificationPrismaRepository } from './infrastructure/notification.prisma.repository';

@Module({
    controllers: [NotificationController],
    providers: [
        NotificationService,
        NotificationGateway,
        {
            provide: NOTIFICATION_REPOSITORY,
            useClass: NotificationPrismaRepository,
        },
    ],
    exports: [NotificationService],
})
export class NotificationModule { }
