import { Module } from '@nestjs/common';
import { PaymentController } from './presentation/payment.controller';
import { PaymentService } from './application/payment.service';
import { ExternalModule } from '../../infrastructure/external/external.module';
import { OrderModule } from '../order/order.module';
import { ShopModule } from '../shop/shop.module';

@Module({
    imports: [ExternalModule, OrderModule, ShopModule],
    controllers: [PaymentController],
    providers: [PaymentService],
    exports: [PaymentService]
})
export class PaymentModule { }
