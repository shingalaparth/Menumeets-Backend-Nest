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
exports.SystemService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../infrastructure/database/prisma.service");
const DEFAULT_PAYMENT_CONFIG = {
    masterSwitch: true,
    allowOfflineOrders: false,
    gateways: {
        cashfree: true,
        razorpay: false
    }
};
let SystemService = class SystemService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPaymentConfig() {
        let config = await this.prisma.systemConfig.findUnique({ where: { key: 'PAYMENT_CONFIG' } });
        if (!config) {
            config = await this.prisma.systemConfig.create({
                data: {
                    key: 'PAYMENT_CONFIG',
                    value: DEFAULT_PAYMENT_CONFIG,
                    description: 'Global control for payment gateways'
                }
            });
        }
        return config.value;
    }
    async updatePaymentConfig(vendorId, body) {
        const { masterSwitch, gateways, allowOfflineOrders } = body;
        const config = await this.prisma.systemConfig.upsert({
            where: { key: 'PAYMENT_CONFIG' },
            update: {
                value: { masterSwitch, gateways, allowOfflineOrders: !!allowOfflineOrders },
                updatedBy: vendorId
            },
            create: {
                key: 'PAYMENT_CONFIG',
                value: { masterSwitch, gateways, allowOfflineOrders: !!allowOfflineOrders },
                description: 'Global control for payment gateways',
                updatedBy: vendorId
            }
        });
        return { success: true, message: "Payment configuration updated", data: config.value };
    }
    async getPublicPaymentConfig() {
        const config = await this.prisma.systemConfig.findUnique({ where: { key: 'PAYMENT_CONFIG' } });
        const val = config ? config.value : DEFAULT_PAYMENT_CONFIG;
        return {
            masterSwitch: val.masterSwitch,
            allowOfflineOrders: val.allowOfflineOrders ?? false,
            gateways: {
                cashfree: val.gateways?.cashfree ?? true,
            }
        };
    }
};
exports.SystemService = SystemService;
exports.SystemService = SystemService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SystemService);
//# sourceMappingURL=system.service.js.map