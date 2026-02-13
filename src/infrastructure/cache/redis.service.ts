/**
 * Redis Service — migrated from old config/redis.js
 *
 * Old: Created ioredis instance with reconnect logic, exported globally
 * New: NestJS injectable service with same reconnect logic
 */
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: Redis;
    private hasLoggedError = false;

    constructor(private configService: ConfigService) {
        const uri = this.configService.get<string>('redis.uri', 'redis://localhost:6379');
        const connectTimeout = this.configService.get<number>('redis.connectTimeout', 5000);
        const maxRetriesPerRequest = this.configService.get<number>('redis.maxRetriesPerRequest', 3);

        this.client = new Redis(uri, {
            connectTimeout,
            maxRetriesPerRequest,

            // Auto-reconnect with exponential backoff (same as old redis.js)
            retryStrategy: (times: number) => {
                if (times > 10) {
                    console.log('⚠️ Redis: Max retries reached, running in DB-only mode');
                    return null;
                }
                const delay = Math.min(times * 1000, 30000);
                console.log(`🔄 Redis: Reconnecting in ${delay / 1000}s (attempt ${times})`);
                return delay;
            },

            reconnectOnError: () => {
                console.log('🔄 Redis: Reconnecting after error...');
                return true;
            },
        });

        this.client.on('connect', () => console.log('✅ Redis Connected Successfully'));
        this.client.on('ready', () => console.log('✅ Redis Ready for commands'));

        this.client.on('error', (err) => {
            if (!this.hasLoggedError) {
                if (err.message.includes('ECONNREFUSED')) {
                    console.log('⚠️  Redis Connection Failed (Is Redis running?)');
                    console.log("👉 Running in 'Database Only' mode (Caching Disabled)");
                } else {
                    console.error('❌ Redis Error:', err.message);
                }
                this.hasLoggedError = true;
            }
        });

        this.client.on('reconnecting', () => {
            this.hasLoggedError = false;
        });
    }

    onModuleInit() {
        // Connection is established in constructor via ioredis
    }

    async onModuleDestroy() {
        await this.client.quit();
    }

    /** Get the raw ioredis client for advanced operations */
    getClient(): Redis {
        return this.client;
    }

    /** Basic get */
    async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    /** Basic set with optional TTL (seconds) */
    async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
        if (ttlSeconds) {
            await this.client.set(key, value, 'EX', ttlSeconds);
        } else {
            await this.client.set(key, value);
        }
    }

    /** Delete key(s) */
    async del(...keys: string[]): Promise<number> {
        return this.client.del(...keys);
    }

    /** Pipeline for batch operations (same as old cacheUtils.js pattern) */
    pipeline() {
        return this.client.pipeline();
    }
}
