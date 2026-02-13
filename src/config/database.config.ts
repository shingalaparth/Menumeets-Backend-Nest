/**
 * Database Config — replaces old config/database.js (MongoDB → PostgreSQL)
 * Prisma uses DATABASE_URL directly, but we expose it here for reference.
 */
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
    url: process.env.DATABASE_URL,
}));
