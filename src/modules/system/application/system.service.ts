import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

const DEFAULT_PAYMENT_CONFIG = {
    masterSwitch: true,
    allowOfflineOrders: false,
    gateways: {
        cashfree: true,
        razorpay: false
    }
};

@Injectable()
export class SystemService {
    constructor(private prisma: PrismaService) { }

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

    async updatePaymentConfig(vendorId: string, body: any) {
        const { masterSwitch, gateways, allowOfflineOrders } = body;

        // Basic validation could go here

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
        const val: any = config ? config.value : DEFAULT_PAYMENT_CONFIG;

        return {
            masterSwitch: val.masterSwitch,
            allowOfflineOrders: val.allowOfflineOrders ?? false,
            gateways: {
                cashfree: val.gateways?.cashfree ?? true,
            }
        };
    }
}
