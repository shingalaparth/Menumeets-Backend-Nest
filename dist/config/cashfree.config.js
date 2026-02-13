"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('cashfree', () => ({
    appId: process.env.CASHFREE_APP_ID,
    secretKey: process.env.CASHFREE_SECRET_KEY,
    environment: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'SANDBOX',
}));
//# sourceMappingURL=cashfree.config.js.map