import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

/**
 * Central Audit Service — logs who/what/when/before-after for critical mutations.
 * Used across admin, order, payment modules for governance compliance.
 */
@Injectable()
export class AuditService {
    constructor(private prisma: PrismaService) { }

    async log(params: {
        actorId: string;
        actorType: string; // admin, vendor, system
        action: string;    // ORDER_STATUS_CHANGE, SHOP_DELETE, SETTLEMENT_PROCESS
        entityType: string; // Order, Shop, Vendor, Settlement
        entityId: string;
        before?: any;
        after?: any;
        metadata?: any;
        ip?: string;
    }) {
        return this.prisma.auditLog.create({
            data: {
                actorId: params.actorId,
                actorType: params.actorType,
                action: params.action,
                entityType: params.entityType,
                entityId: params.entityId,
                before: params.before || undefined,
                after: params.after || undefined,
                metadata: params.metadata || undefined,
                ip: params.ip || undefined,
            }
        });
    }

    async getLogs(filters: {
        actorId?: string;
        entityType?: string;
        entityId?: string;
        action?: string;
        startDate?: string;
        endDate?: string;
        page?: number;
        limit?: number;
    }) {
        const { page = 1, limit = 50 } = filters;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (filters.actorId) where.actorId = filters.actorId;
        if (filters.entityType) where.entityType = filters.entityType;
        if (filters.entityId) where.entityId = filters.entityId;
        if (filters.action) where.action = filters.action;
        if (filters.startDate || filters.endDate) {
            where.createdAt = {};
            if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
            if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
        }

        const [logs, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            this.prisma.auditLog.count({ where })
        ]);

        return {
            logs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
}
