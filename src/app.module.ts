/**
 * Root AppModule
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';

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

// Shared Infrastructure Services
import { QrController } from './shared/presentation/qr.controller';
import { QrService } from './shared/services/qr.service';
import { TasksService } from './shared/services/tasks.service';

@Module({
    imports: [
        // ── Global Config ──
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

        // ── Rate Limiting ──
        ThrottlerModule.forRoot([{
            ttl: 60000,
            limit: 100,
        }]),

        // ── Background Jobs ──
        ScheduleModule.forRoot(),

        // ── Infrastructure ──
        PrismaModule,
        RedisModule,
        ExternalModule,

        // ── Domain Modules ──
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
    controllers: [QrController],
    providers: [
        // Global rate limiter
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        QrService,
        TasksService,
    ],
})
export class AppModule { }
