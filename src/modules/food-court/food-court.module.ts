import { Module } from '@nestjs/common';
import { FoodCourtController } from './presentation/food-court.controller';
import { FoodCourtService } from './application/food-court.service';
import { FOOD_COURT_REPOSITORY } from './domain/food-court.repository';
import { FoodCourtPrismaRepository } from './infrastructure/food-court.prisma.repository';
import { ShopModule } from '../shop/shop.module';

@Module({
    imports: [ShopModule],
    controllers: [FoodCourtController],
    providers: [
        FoodCourtService,
        {
            provide: FOOD_COURT_REPOSITORY,
            useClass: FoodCourtPrismaRepository,
        },
    ],
    exports: [FoodCourtService],
})
export class FoodCourtModule { }
