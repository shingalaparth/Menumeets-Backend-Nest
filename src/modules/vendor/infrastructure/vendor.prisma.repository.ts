/**
 * Vendor Prisma Repository — Infrastructure layer
 * Concrete implementation of VendorRepository using PrismaService.
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { VendorRepository } from '../domain/vendor.repository';
import { VendorEntity, CreateVendorData, VendorActivityLogEntity } from '../domain/vendor.entity';
import { hashPassword } from '../../../shared/utils/hash.util';

@Injectable()
export class VendorPrismaRepository implements VendorRepository {
    constructor(private prisma: PrismaService) { }

    async findById(id: string): Promise<VendorEntity | null> {
        return this.prisma.vendor.findUnique({ where: { id } }) as Promise<VendorEntity | null>;
    }

    async findByEmail(email: string): Promise<VendorEntity | null> {
        return this.prisma.vendor.findUnique({ where: { email } }) as Promise<VendorEntity | null>;
    }

    async findByEmailOrPhone(email: string, phone: string): Promise<VendorEntity | null> {
        return this.prisma.vendor.findFirst({
            where: { OR: [{ email }, { phone }] },
        }) as Promise<VendorEntity | null>;
    }

    async findAll(): Promise<Partial<VendorEntity>[]> {
        return this.prisma.vendor.findMany({
            select: {
                id: true, name: true, email: true, phone: true, role: true,
                createdAt: true, updatedAt: true,
            },
        });
    }

    async create(data: CreateVendorData): Promise<VendorEntity> {
        const hashed = await hashPassword(data.password);
        return this.prisma.vendor.create({
            data: { ...data, password: hashed },
        }) as Promise<VendorEntity>;
    }

    async update(id: string, data: Partial<VendorEntity>): Promise<VendorEntity> {
        // Hash password if being updated (keeps hashing in infra layer)
        if (data.password) {
            data.password = await hashPassword(data.password);
        }
        return this.prisma.vendor.update({
            where: { id },
            data: data as any,
        }) as unknown as VendorEntity;
    }

    async delete(id: string): Promise<void> {
        await this.prisma.vendor.delete({ where: { id } });
    }

    // ── Activity Logs ──

    async createActivityLog(data: {
        vendorId: string;
        action: string;
        details?: string;
        ip?: string;
        device?: string;
    }): Promise<void> {
        try {
            await this.prisma.vendorActivityLog.create({ data });
        } catch (e) {
            console.error('Activity Log Error:', e);
        }
    }

    async findActivityLogs(vendorId: string, limit = 50): Promise<VendorActivityLogEntity[]> {
        return this.prisma.vendorActivityLog.findMany({
            where: { vendorId },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
}
