import { InvoiceRepository } from '../domain/invoice.repository';
export declare class InvoiceService {
    private invoiceRepo;
    constructor(invoiceRepo: InvoiceRepository);
    getInvoiceByNumber(invoiceNumber: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        userId: string | null;
        subtotal: number;
        orderId: string | null;
        invoiceNumber: string;
        taxAmount: number;
        grandTotal: number;
    }>;
    createInvoiceForOrder(order: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        userId: string | null;
        subtotal: number;
        orderId: string | null;
        invoiceNumber: string;
        taxAmount: number;
        grandTotal: number;
    } | null>;
    createConsolidatedInvoiceForSession(session: any, orders: any[]): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        userId: string | null;
        subtotal: number;
        orderId: string | null;
        invoiceNumber: string;
        taxAmount: number;
        grandTotal: number;
    } | null>;
    generateInvoicePDF(invoice: any, res: any): Promise<void>;
}
