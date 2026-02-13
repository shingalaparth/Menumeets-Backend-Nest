/**
 * Redis Config — migrated from old config/redis.js
 * Connection logic moves to infrastructure/cache/redis.service.ts
 * This file only holds the configuration values.
 */
import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
    uri: process.env.REDIS_URI || 'redis://localhost:6379',
    connectTimeout: 5000,
    maxRetriesPerRequest: 3,
}));
