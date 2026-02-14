/**
 * NestJS Bootstrap
 */
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';

async function bootstrap() {
    const logger = new Logger('Bootstrap');
    const app = await NestFactory.create(AppModule, { rawBody: true });

    const configService = app.get(ConfigService);
    const port = configService.get<number>('app.port', 3000);
    const frontendUrl = configService.get<string>('app.frontendUrl', 'http://localhost:5173');
    const env = configService.get<string>('app.env', 'development');

    // ── Global Prefix ──
    app.setGlobalPrefix('api');

    // ── Global Pipes, Filters, Interceptors ──
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());

    // ── CORS ──
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

    // ── Cookie Parser ──
    app.use(cookieParser());

    // ── Start ──
    await app.listen(port);
    logger.log(`🚀 Server running on http://localhost:${port}`);
}

bootstrap();
