import { Module } from '@nestjs/common';
import { TableService } from './application/table.service';
import { TableController } from './presentation/table.controller';
import { TABLE_REPOSITORY } from './domain/table.repository';
import { TablePrismaRepository } from './infrastructure/table.prisma.repository';
import { ShopModule } from '../shop/shop.module';

@Module({
    imports: [ShopModule], // for ownership checks
    controllers: [TableController],
    providers: [
        TableService,
        {
            provide: TABLE_REPOSITORY,
            useClass: TablePrismaRepository,
        },
    ],
    exports: [TableService],
})
export class TableModule { }
