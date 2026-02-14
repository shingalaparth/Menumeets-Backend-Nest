import { Module } from '@nestjs/common';
import { OrderController } from './presentation/order.controller';
import { OrderService } from './application/order.service';
import { ORDER_REPOSITORY } from './domain/order.repository';
import { OrderPrismaRepository } from './infrastructure/order.prisma.repository';
import { NotificationModule } from '../notification/notification.module';
import { CartModule } from '../cart/cart.module';
import { TableModule } from '../table/table.module';

@Module({
    imports: [CartModule, TableModule, NotificationModule],
    controllers: [OrderController],
    providers: [
        OrderService,
        { provide: ORDER_REPOSITORY, useClass: OrderPrismaRepository }
    ],
    exports: [OrderService]
})
export class OrderModule { }
