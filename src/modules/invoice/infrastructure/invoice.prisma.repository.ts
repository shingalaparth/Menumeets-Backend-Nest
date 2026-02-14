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
            include: { order: true, user: true }
        });
    }

    async findByOrderId(orderId: string): Promise<Invoice | null> {
        return this.prisma.invoice.findFirst({
            where: { orderId }
        });
    }

    async findByInvoiceNumber(invoiceNumber: string): Promise<Invoice | null> {
        return this.prisma.invoice.findUnique({
            where: { invoiceNumber }
        });
    }

    async count(): Promise<number> {
        return this.prisma.invoice.count();
    }
}
