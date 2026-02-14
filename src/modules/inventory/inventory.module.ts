import { Module } from '@nestjs/common';
import { InventoryController } from './presentation/inventory.controller';
import { InventoryService } from './application/inventory.service';
import { InventoryPrismaRepository } from './infrastructure/inventory.prisma.repository';
import { INVENTORY_REPOSITORY } from './domain/inventory.repository';

import { NotificationModule } from '../notification/notification.module';

@Module({
    imports: [NotificationModule],
    controllers: [InventoryController],
    providers: [
        InventoryService,
        {
            provide: INVENTORY_REPOSITORY,
            useClass: InventoryPrismaRepository,
        },
    ],
    exports: [InventoryService],
})
export class InventoryModule { }
