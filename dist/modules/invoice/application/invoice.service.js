"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceService = void 0;
const common_1 = require("@nestjs/common");
const invoice_repository_1 = require("../domain/invoice.repository");
const PDFDocument = require("pdfkit");
let InvoiceService = class InvoiceService {
    constructor(invoiceRepo) {
        this.invoiceRepo = invoiceRepo;
    }
    async getInvoiceByNumber(invoiceNumber) {
        const invoice = await this.invoiceRepo.findByInvoiceNumber(invoiceNumber);
        if (!invoice)
            throw new common_1.NotFoundException('Invoice not found');
        return invoice;
    }
    async createInvoiceForOrder(order) {
        if (order.tableSessionId && order.isPOS) {
            return null;
        }
        const count = await this.invoiceRepo.count();
        const timestamp = Date.now().toString().slice(-4);
        const invoiceNumber = `INV-${count + 1}-${timestamp}`;
        const invoiceItems = order.items.map((item) => ({
            name: item.menuItem?.name || item.name,
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
            items: invoiceItems,
            subtotal: order.subtotal,
            grandTotal: order.totalAmount,
            status: order.paymentStatus === 'PAID' ? 'PAID' : 'UNPAID',
            taxAmount: order.taxDetails?.taxAmount || 0,
        });
    }
    async createConsolidatedInvoiceForSession(session, orders) {
        if (!orders || orders.length === 0)
            return null;
        const count = await this.invoiceRepo.count();
        const timestamp = Date.now().toString().slice(-4);
        const invoiceNumber = `INV-SES-${count + 1}-${timestamp}`;
        let allItems = [];
        let grandTotal = 0;
        let totalTax = 0;
        for (const order of orders) {
            grandTotal += order.totalAmount;
            totalTax += (order.taxDetails?.taxAmount || 0);
            const convItems = order.items.map((item) => ({
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
            status: 'PAID',
        });
    }
    async generateInvoicePDF(invoice, res) {
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`);
        doc.pipe(res);
        doc.fontSize(20).text(`Invoice ${invoice.invoiceNumber}`, 100, 100);
        doc.fontSize(14).text(`Date: ${new Date(invoice.createdAt).toDateString()}`, 100, 130);
        doc.text(`Total: ${invoice.grandTotal}`, 100, 150);
        doc.moveDown();
        const items = invoice.items;
        items.forEach(item => {
            doc.fontSize(12).text(`${item.name} x ${item.quantity} = ${item.total}`);
        });
        doc.end();
    }
};
exports.InvoiceService = InvoiceService;
exports.InvoiceService = InvoiceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(invoice_repository_1.INVOICE_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], InvoiceService);
//# sourceMappingURL=invoice.service.js.map