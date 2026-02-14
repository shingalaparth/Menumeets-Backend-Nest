import { Module, Global } from '@nestjs/common';
import { NotificationController } from './presentation/notification.controller';
import { NotificationService } from './application/notification.service';
import { NotificationGateway } from './application/notification.gateway';
import { NOTIFICATION_REPOSITORY } from './domain/notification.repository';
import { NotificationPrismaRepository } from './infrastructure/notification.prisma.repository';
import { EventsService } from '../../shared/services/events.service';

@Global()
@Module({
    controllers: [NotificationController],
    providers: [
        NotificationService,
        NotificationGateway,
        EventsService,
        {
            provide: NOTIFICATION_REPOSITORY,
            useClass: NotificationPrismaRepository,
        },
    ],
    exports: [NotificationService, NotificationGateway, EventsService],
})
export class NotificationModule { }
