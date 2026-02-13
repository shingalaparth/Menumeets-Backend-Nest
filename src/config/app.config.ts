/**
 * App Config — migrated from old config/env.js
 * Covers: PORT, NODE_ENV, FRONTEND_URL, BCRYPT_SALT_ROUNDS
 */
import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    env: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
}));
