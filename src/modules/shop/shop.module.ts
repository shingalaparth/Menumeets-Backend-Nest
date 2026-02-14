import { Module } from '@nestjs/common';
import { ShopService } from './application/shop.service';
import { ShopController } from './presentation/shop.controller';
import { SHOP_REPOSITORY } from './domain/shop.repository';
import { ShopPrismaRepository } from './infrastructure/shop.prisma.repository';
import { SHOP_REQUEST_REPOSITORY } from './domain/shop-request.repository';
import { ShopRequestPrismaRepository } from './infrastructure/shop-request.prisma.repository';

@Module({
    controllers: [ShopController],
    providers: [
        ShopService,
        {
            provide: SHOP_REPOSITORY,
            useClass: ShopPrismaRepository,
        },
        {
            provide: SHOP_REQUEST_REPOSITORY,
            useClass: ShopRequestPrismaRepository,
        },
    ],
    exports: [ShopService, SHOP_REQUEST_REPOSITORY],
})
export class ShopModule { }
