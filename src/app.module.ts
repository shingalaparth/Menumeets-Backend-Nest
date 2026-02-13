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
        // PrismaModule,
        // RedisModule,
        // BullMQModule,
        // ExternalModule,

        // ── Domain Modules (Phase 4+) ──
        // UserModule,
        // AuthModule,
        // VendorModule,
        // ShopModule,
        // MenuModule,
        // ... etc
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
