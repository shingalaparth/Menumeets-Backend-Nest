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
    getInvoiceById(id: string): Promise<{
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
    getShopInvoices(shopId: string, page?: number, limit?: number): Promise<{
        invoices: import(".prisma/client").Invoice[];
        total: number;
    }>;
    getMyInvoices(userId: string): Promise<{
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
    }[]>;
    getInvoiceByOrderId(orderId: string): Promise<{
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
    updateInvoiceStatus(id: string, status: string): Promise<{
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
    generateInvoiceFromParentOrder(parentOrder: any): Promise<{
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
    generateInvoicePDF(invoice: any, res: any): Promise<void>;
}
