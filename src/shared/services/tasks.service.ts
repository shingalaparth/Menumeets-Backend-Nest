import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../infrastructure/database/prisma.service';

/**
 * Background scheduled tasks for operational hygiene.
 * - Expire stale payment-pending orders
 * - Auto-generate monthly settlement records
 */
@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    constructor(private prisma: PrismaService) { }

    /**
     * Every day at 2AM — expire orders stuck in "Pending" + "UNPAID" for > 24h
     */
    @Cron('0 2 * * *')
    async cleanupExpiredOrders() {
        const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const { count } = await this.prisma.order.updateMany({
            where: {
                orderStatus: 'Pending',
                paymentStatus: 'UNPAID',
                createdAt: { lt: cutoff }
            },
            data: {
                orderStatus: 'Cancelled'
            }
        });

        if (count > 0) {
            this.logger.log(`Cleaned up ${count} expired orders`);
        }
    }

    /**
     * 1st of every month at midnight — generate settlement records for prior month
     */
    @Cron('0 0 1 * *')
    async generateMonthlySettlements() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth(); // current month (0-indexed); we want last month
        const lastMonth = month === 0 ? 12 : month;
        const lastYear = month === 0 ? year - 1 : year;
        const period = `${lastYear}-${String(lastMonth).padStart(2, '0')}`;

        const start = new Date(lastYear, lastMonth - 1, 1);
        const end = new Date(year, month, 1);

        // Get all active shops
        const shops = await this.prisma.shop.findMany({
            where: { isActive: true },
            select: { id: true, settings: true }
        });

        for (const shop of shops) {
            // Check if settlement already exists for this period
            const existing = await this.prisma.settlement.findFirst({
                where: { shopId: shop.id, period }
            });
            if (existing) continue;

            // Calculate revenue for the period
            const orders = await this.prisma.order.findMany({
                where: {
                    shopId: shop.id,
                    orderStatus: 'Delivered',
                    paymentStatus: 'PAID',
                    createdAt: { gte: start, lt: end }
                },
                select: { totalAmount: true }
            });

            const totalAmount = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
            if (totalAmount === 0) continue;

            const commissionRate = ((shop.settings as any)?.profile?.platformCommission || 10) / 100;
            const commission = Math.round(totalAmount * commissionRate * 100) / 100;
            const netPayout = Math.round((totalAmount - commission) * 100) / 100;

            await this.prisma.settlement.create({
                data: {
                    shopId: shop.id,
                    amount: totalAmount,
                    commission,
                    netPayout,
                    period,
                    status: 'PENDING'
                }
            });
        }

        this.logger.log(`Generated settlements for period ${period}`);
    }
}
