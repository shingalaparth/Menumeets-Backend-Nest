/**
 * NestJS Bootstrap — migrated from old server.js
 *
 * Old server.js responsibilities:
 *   1. Create HTTP server               → NestJS handles this
 *   2. Setup Socket.io                   → @nestjs/websockets (Phase 2)
 *   3. Connect to MongoDB               → Prisma handles this (Phase 2)
 *   4. Listen on port                    → app.listen() below
 *
 * Socket.io waiter_call events will be migrated in a Gateway module later.
 */
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);
    const port = configService.get<number>('app.port', 3000);
    const frontendUrl = configService.get<string>('app.frontendUrl', 'http://localhost:5173');
    const env = configService.get<string>('app.env', 'development');

    // ── Global Prefix ──
    app.setGlobalPrefix('api');

    // ── CORS (migrated from old app.js) ──
    const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:3000',
        frontendUrl,
    ].filter(Boolean);

    app.enableCors({
        origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin) || env !== 'production') {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // ── Cookie Parser (migrated from old app.js) ──
    app.use(cookieParser());

    // ── Start ──
    await app.listen(port);
    console.log(`🚀 Server running on http://localhost:${port}`);
}

bootstrap();
