import { Module } from '@nestjs/common';
import { FranchiseController } from './presentation/franchise.controller';
import { FranchiseMenuController } from './presentation/franchise-menu.controller';
import { FranchiseService } from './application/franchise.service';
import { FRANCHISE_REPOSITORY } from './domain/franchise.repository';
import { FranchisePrismaRepository } from './infrastructure/franchise.prisma.repository';
import { ShopModule } from '../shop/shop.module';
import { PrismaModule } from '../../infrastructure/database/prisma.module';

@Module({
    imports: [ShopModule, PrismaModule],
    controllers: [FranchiseController, FranchiseMenuController],
    providers: [
        FranchiseService,
        {
            provide: FRANCHISE_REPOSITORY,
            useClass: FranchisePrismaRepository,
        },
    ],
    exports: [FranchiseService],
})
export class FranchiseModule { }
