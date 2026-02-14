import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { InvoiceRepository } from '../domain/invoice.repository';
import { Invoice } from '@prisma/client';

@Injectable()
export class InvoicePrismaRepository implements InvoiceRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: any): Promise<Invoice> {
        return this.prisma.invoice.create({ data });
    }

    async findById(id: string): Promise<Invoice | null> {
        return this.prisma.invoice.findUnique({
            where: { id },
            include: { order: { include: { shop: true, items: true } }, user: true }
        });
    }

    async findByOrderId(orderId: string): Promise<Invoice | null> {
        return this.prisma.invoice.findFirst({
            where: { orderId },
            include: { order: { include: { shop: true, items: true } }, user: true }
        });
    }

    async findByInvoiceNumber(invoiceNumber: string): Promise<Invoice | null> {
        return this.prisma.invoice.findUnique({
            where: { invoiceNumber },
            include: { order: { include: { shop: true, items: true } }, user: true }
        });
    }

    async count(): Promise<number> {
        return this.prisma.invoice.count();
    }

    // ── Parity additions ──

    async findByShopId(shopId: string, page: number, limit: number): Promise<{ invoices: Invoice[]; total: number }> {
        const where = {
            order: { shopId }
        };

        const [invoices, total] = await Promise.all([
            this.prisma.invoice.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                include: { order: { include: { items: true } }, user: true }
            }),
            this.prisma.invoice.count({ where })
        ]);

        return { invoices, total };
    }

    async findByUserId(userId: string): Promise<Invoice[]> {
        return this.prisma.invoice.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: { order: { include: { shop: true, items: true } } }
        });
    }

    async updateStatus(id: string, status: string): Promise<Invoice> {
        return this.prisma.invoice.update({
            where: { id },
            data: { status }
        });
    }
}
