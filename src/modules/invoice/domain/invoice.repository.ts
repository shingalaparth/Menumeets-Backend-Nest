import { Invoice } from '@prisma/client';

export const INVOICE_REPOSITORY = 'INVOICE_REPOSITORY';

export interface InvoiceRepository {
    create(data: any): Promise<Invoice>;
    findById(id: string): Promise<Invoice | null>;
    findByOrderId(orderId: string): Promise<Invoice | null>;
    findByInvoiceNumber(invoiceNumber: string): Promise<Invoice | null>;
    count(): Promise<number>;

    // ── Parity additions ──
    findByShopId(shopId: string, page: number, limit: number): Promise<{ invoices: Invoice[]; total: number }>;
    findByUserId(userId: string): Promise<Invoice[]>;
    updateStatus(id: string, status: string): Promise<Invoice>;
}
