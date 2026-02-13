"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('redis', () => ({
    uri: process.env.REDIS_URI || 'redis://localhost:6379',
    connectTimeout: 5000,
    maxRetriesPerRequest: 3,
}));
//# sourceMappingURL=redis.config.js.map