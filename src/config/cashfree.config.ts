/**
 * Cashfree Config — migrated from old config/cashfree.js
 * Cashfree is the PRIMARY payment gateway (Razorpay was secondary/optional).
 */
import { registerAs } from '@nestjs/config';

export default registerAs('cashfree', () => ({
    appId: process.env.CASHFREE_APP_ID,
    secretKey: process.env.CASHFREE_SECRET_KEY,
    environment: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'SANDBOX',
}));
