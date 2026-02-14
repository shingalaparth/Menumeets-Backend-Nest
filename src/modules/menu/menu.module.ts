import { Module } from '@nestjs/common';
import { MenuService } from './application/menu.service';
import { MenuController } from './presentation/menu.controller';
import { PublicMenuController } from './presentation/public.menu.controller';
import { MENU_REPOSITORY } from './domain/menu.repository';
import { MenuPrismaRepository } from './infrastructure/menu.prisma.repository';
import { ShopModule } from '../shop/shop.module';
import { TableModule } from '../table/table.module';
import { RedisModule } from '../../infrastructure/cache/redis.module';

import { GlobalMenuService } from './application/global-menu.service';
import { GlobalMenuController } from './presentation/global-menu.controller';

@Module({
    imports: [ShopModule, TableModule, RedisModule], // needs ShopService, TableService(for public), RedisService
    controllers: [MenuController, PublicMenuController, GlobalMenuController],
    providers: [
        MenuService,
        GlobalMenuService,
        {
            provide: MENU_REPOSITORY,
            useClass: MenuPrismaRepository,
        },
    ],
    exports: [MenuService, GlobalMenuService],
})
export class MenuModule { }
