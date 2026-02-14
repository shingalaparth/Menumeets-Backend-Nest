import { InvoiceService } from '../application/invoice.service';
import { Response } from 'express';
export declare class InvoiceController {
    private invoiceService;
    constructor(invoiceService: InvoiceService);
    getShopInvoices(shopId: string, page?: string, limit?: string): Promise<{
        invoices: import(".prisma/client").Invoice[];
        total: number;
    }>;
    getMyInvoices(req: any): Promise<{
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
    downloadInvoice(invoiceNumber: string, res: Response): Promise<void>;
    downloadInvoiceByOrder(orderId: string, res: Response): Promise<void>;
    generateInvoiceFromParentOrder(orderId: string): Promise<{
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
}
