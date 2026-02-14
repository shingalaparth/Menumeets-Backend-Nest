import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { INVOICE_REPOSITORY, InvoiceRepository } from '../domain/invoice.repository';
// import PDFDocument from 'pdfkit'; // Requires esModuleInterop or import * as PDFDocument
import * as PDFDocument from 'pdfkit';

@Injectable()
export class InvoiceService {
    constructor(
        @Inject(INVOICE_REPOSITORY) private invoiceRepo: InvoiceRepository
    ) { }

    async getInvoiceByNumber(invoiceNumber: string) {
        const invoice = await this.invoiceRepo.findByInvoiceNumber(invoiceNumber);
        if (!invoice) throw new NotFoundException('Invoice not found');
        return invoice;
    }

    async createInvoiceForOrder(order: any) {
        // Prevent creating individual invoices for Captain/Session orders if needed
        // But logic says: "createInvoiceForOrder" is called explicitly.
        // If logic dictates blocking POS orders:
        if (order.tableSessionId && order.isPOS) {
            return null; // Handled by Session Close
        }

        const count = await this.invoiceRepo.count();
        const timestamp = Date.now().toString().slice(-4);
        const invoiceNumber = `INV-${count + 1}-${timestamp}`;

        const invoiceItems = order.items.map((item: any) => ({
            name: item.menuItem?.name || item.name, // Handle populated vs flat
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
            variant: item.variant,
            addOns: item.addOns
        }));

        return this.invoiceRepo.create({
            invoiceNumber,
            orderId: order.id,
            userId: order.userId,
            items: invoiceItems, // Prisma handles JSON
            subtotal: order.subtotal,
            grandTotal: order.totalAmount,
            status: order.paymentStatus === 'PAID' ? 'PAID' : 'UNPAID',
            taxAmount: order.taxDetails?.taxAmount || 0,
            // Additional metadata if schema allows or fits into existing fields
            // tableNumber: order.table?.tableNumber
        });
    }

    async createConsolidatedInvoiceForSession(session: any, orders: any[]) {
        if (!orders || orders.length === 0) return null;

        const count = await this.invoiceRepo.count();
        const timestamp = Date.now().toString().slice(-4);
        const invoiceNumber = `INV-SES-${count + 1}-${timestamp}`;

        let allItems: any[] = [];
        let grandTotal = 0;
        let totalTax = 0;

        for (const order of orders) {
            grandTotal += order.totalAmount;
            totalTax += (order.taxDetails?.taxAmount || 0);

            const convItems = order.items.map((item: any) => ({
                name: item.menuItem?.name || item.name,
                quantity: item.quantity,
                price: item.price,
                total: item.price * item.quantity,
                variant: item.variant,
                addOns: item.addOns
            }));
            allItems = [...allItems, ...convItems];
        }

        return this.invoiceRepo.create({
            invoiceNumber,
            userId: orders[0].userId || null,
            items: allItems,
            subtotal: grandTotal - totalTax,
            grandTotal: grandTotal,
            taxAmount: totalTax,
            status: 'PAID', // Assumed paid logic from legacy
            // shopId would be nice in Invoice schema but it's not there? 
            // In schema: userId, orderId. No shopId. 
            // We rely on Order->Shop or implicitly known.
        });
    }

    async generateInvoicePDF(invoice: any, res: any) {
        const doc = new PDFDocument({ size: 'A4', margin: 50 });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`);
        doc.pipe(res);

        // ... Replication of PDF generation logic ...
        // Simplification for migration speed:
        doc.fontSize(20).text(`Invoice ${invoice.invoiceNumber}`, 100, 100);
        doc.fontSize(14).text(`Date: ${new Date(invoice.createdAt).toDateString()}`, 100, 130);
        doc.text(`Total: ${invoice.grandTotal}`, 100, 150);

        doc.moveDown();
        // Items
        const items = invoice.items as any[];
        items.forEach(item => {
            doc.fontSize(12).text(`${item.name} x ${item.quantity} = ${item.total}`);
        });

        doc.end();
    }
}
