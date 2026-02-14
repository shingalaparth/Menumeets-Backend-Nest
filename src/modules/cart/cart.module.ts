import { Module } from '@nestjs/common';
import { CartController } from './presentation/cart.controller';
import { CartService } from './application/cart.service';
import { CART_REPOSITORY } from './domain/cart.repository';
import { CartPrismaRepository } from './infrastructure/cart.prisma.repository';
import { MenuModule } from '../menu/menu.module';

@Module({
    imports: [MenuModule],
    controllers: [CartController],
    providers: [
        CartService,
        { provide: CART_REPOSITORY, useClass: CartPrismaRepository }
    ],
    exports: [CartService, CART_REPOSITORY]
})
export class CartModule { }
