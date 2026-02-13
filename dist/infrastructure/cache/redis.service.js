"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = require("ioredis");
let RedisService = class RedisService {
    constructor(configService) {
        this.configService = configService;
        this.hasLoggedError = false;
        const uri = this.configService.get('redis.uri', 'redis://localhost:6379');
        const connectTimeout = this.configService.get('redis.connectTimeout', 5000);
        const maxRetriesPerRequest = this.configService.get('redis.maxRetriesPerRequest', 3);
        this.client = new ioredis_1.default(uri, {
            connectTimeout,
            maxRetriesPerRequest,
            retryStrategy: (times) => {
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
                }
                else {
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
    }
    async onModuleDestroy() {
        await this.client.quit();
    }
    getClient() {
        return this.client;
    }
    async get(key) {
        return this.client.get(key);
    }
    async set(key, value, ttlSeconds) {
        if (ttlSeconds) {
            await this.client.set(key, value, 'EX', ttlSeconds);
        }
        else {
            await this.client.set(key, value);
        }
    }
    async del(...keys) {
        return this.client.del(...keys);
    }
    pipeline() {
        return this.client.pipeline();
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RedisService);
//# sourceMappingURL=redis.service.js.map