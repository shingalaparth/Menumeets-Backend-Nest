/**
 * Root AppModule — migrated from old app.js
 *
 * Old app.js responsibilities:
 *   1. Express middlewares (json, urlencoded, cors, cookieParser) → main.ts
 *   2. Register all routes                                        → Module imports below
 *   3. Global error handler                                       → HttpExceptionFilter (Phase 3)
 *   4. Attach Socket.io to req                                    → WebSocket Gateway (Phase 2)
 *
 * Modules will be imported here as they are migrated.
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Config files
import {
    appConfig,
    databaseConfig,
    redisConfig,
    jwtConfig,
    cloudinaryConfig,
    cashfreeConfig,
} from './config';

// Infrastructure
import { PrismaModule } from './infrastructure/database/prisma.module';
import { RedisModule } from './infrastructure/cache/redis.module';
import { ExternalModule } from './infrastructure/external/external.module';

// Domain Modules (Phase 4)
import { UserModule } from './modules/user/user.module';
import { VendorModule } from './modules/vendor/vendor.module';
import { AuthModule } from './modules/auth/auth.module';
import { ShopModule } from './modules/shop/shop.module';
import { MenuModule } from './modules/menu/menu.module';
import { TableModule } from './modules/table/table.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';
import { PaymentModule } from './modules/payment/payment.module';
import { StaffModule } from './modules/staff/staff.module';
import { KOTModule } from './modules/kot/kot.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { CaptainModule } from './modules/captain/captain.module';
import { FranchiseModule } from './modules/franchise/franchise.module';
import { FoodCourtModule } from './modules/food-court/food-court.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ReviewModule } from './modules/review/review.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { AdminModule } from './modules/admin/admin.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { SystemModule } from './modules/system/system.module';

@Module({
    imports: [
        // ── Global Config (replaces old config/env.js) ──
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
            load: [
                appConfig,
                databaseConfig,
                redisConfig,
                jwtConfig,
                cloudinaryConfig,
                cashfreeConfig,
            ],
        }),

        // ── Infrastructure (Phase 2) ──
        PrismaModule,
        RedisModule,
        ExternalModule,

        // ── Domain Modules (Phase 4) ──
        UserModule,
        VendorModule,
        AuthModule,
        ShopModule,
        MenuModule,
        TableModule,
        CartModule,
        OrderModule,
        PaymentModule,
        StaffModule,
        KOTModule,
        InvoiceModule,
        CaptainModule,
        FranchiseModule,
        FoodCourtModule,
        NotificationModule,
        ReviewModule,
        InventoryModule,
        AdminModule,
        AnalyticsModule,
        SystemModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
