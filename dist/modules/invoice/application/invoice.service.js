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
    async getInvoiceById(id) {
        const invoice = await this.invoiceRepo.findById(id);
        if (!invoice)
            throw new common_1.NotFoundException('Invoice not found');
        return invoice;
    }
    async getShopInvoices(shopId, page = 1, limit = 20) {
        return this.invoiceRepo.findByShopId(shopId, page, limit);
    }
    async getMyInvoices(userId) {
        return this.invoiceRepo.findByUserId(userId);
    }
    async getInvoiceByOrderId(orderId) {
        const invoice = await this.invoiceRepo.findByOrderId(orderId);
        if (!invoice)
            throw new common_1.NotFoundException('Invoice not found for this order');
        return invoice;
    }
    async updateInvoiceStatus(id, status) {
        const invoice = await this.invoiceRepo.findById(id);
        if (!invoice)
            throw new common_1.NotFoundException('Invoice not found');
        const validStatuses = ['PAID', 'CANCELLED', 'REFUNDED'];
        if (!validStatuses.includes(status)) {
            throw new common_1.NotFoundException(`Invalid status: ${status}`);
        }
        return this.invoiceRepo.updateStatus(id, status);
    }
    async createInvoiceForOrder(order) {
        if (order.tableSessionId && order.isPOS) {
            return null;
        }
        const existing = await this.invoiceRepo.findByOrderId(order.id);
        if (existing)
            return existing;
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
    async generateInvoiceFromParentOrder(parentOrder) {
        if (!parentOrder || !parentOrder.subOrders || parentOrder.subOrders.length === 0) {
            throw new common_1.NotFoundException('No sub-orders found for this parent order');
        }
        const existing = await this.invoiceRepo.findByOrderId(parentOrder.id);
        if (existing)
            return existing;
        const count = await this.invoiceRepo.count();
        const timestamp = Date.now().toString().slice(-4);
        const invoiceNumber = `INV-PO-${count + 1}-${timestamp}`;
        let allItems = [];
        let grandTotal = 0;
        let totalTax = 0;
        for (const subOrder of parentOrder.subOrders) {
            grandTotal += subOrder.totalAmount;
            totalTax += (subOrder.taxDetails?.taxAmount || 0);
            const convItems = (subOrder.items || []).map((item) => ({
                name: item.menuItem?.name || item.name,
                quantity: item.quantity,
                price: item.price,
                total: item.price * item.quantity,
                shopName: subOrder.shop?.name || 'Unknown',
                variant: item.variant,
                addOns: item.addOns
            }));
            allItems = [...allItems, ...convItems];
        }
        return this.invoiceRepo.create({
            invoiceNumber,
            orderId: parentOrder.id,
            userId: parentOrder.userId,
            items: allItems,
            subtotal: grandTotal - totalTax,
            grandTotal,
            taxAmount: totalTax,
            status: parentOrder.paymentStatus === 'PAID' ? 'PAID' : 'UNPAID',
        });
    }
    async generateInvoicePDF(invoice, res) {
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`);
        doc.pipe(res);
        const order = invoice.order;
        const shopName = order?.shop?.name || 'MenuMeets';
        const shopAddress = order?.shop?.address || '';
        doc.fontSize(22).font('Helvetica-Bold').text(shopName, { align: 'center' });
        if (shopAddress) {
            doc.fontSize(10).font('Helvetica').text(shopAddress, { align: 'center' });
        }
        doc.moveDown(0.5);
        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown(0.5);
        doc.fontSize(14).font('Helvetica-Bold').text('TAX INVOICE');
        doc.fontSize(10).font('Helvetica');
        doc.text(`Invoice #: ${invoice.invoiceNumber}`);
        doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`);
        doc.text(`Status: ${invoice.status}`);
        if (order?.shortOrderId) {
            doc.text(`Order #: ${order.shortOrderId}`);
        }
        if (order?.orderType) {
            doc.text(`Order Type: ${order.orderType}`);
        }
        doc.moveDown();
        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown(0.3);
        const tableTop = doc.y;
        doc.fontSize(10).font('Helvetica-Bold');
        doc.text('Item', 50, tableTop, { width: 200 });
        doc.text('Qty', 260, tableTop, { width: 50, align: 'center' });
        doc.text('Price', 320, tableTop, { width: 80, align: 'right' });
        doc.text('Total', 410, tableTop, { width: 85, align: 'right' });
        doc.moveDown(0.5);
        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown(0.3);
        const items = invoice.items;
        doc.font('Helvetica').fontSize(10);
        for (const item of items) {
            const y = doc.y;
            let itemName = item.name;
            if (item.variant) {
                const variantName = typeof item.variant === 'string' ? item.variant : item.variant?.name;
                if (variantName)
                    itemName += ` (${variantName})`;
            }
            doc.text(itemName, 50, y, { width: 200 });
            doc.text(String(item.quantity), 260, y, { width: 50, align: 'center' });
            doc.text(`₹${Number(item.price).toFixed(2)}`, 320, y, { width: 80, align: 'right' });
            doc.text(`₹${Number(item.total).toFixed(2)}`, 410, y, { width: 85, align: 'right' });
            if (item.addOns && Array.isArray(item.addOns) && item.addOns.length > 0) {
                for (const addOn of item.addOns) {
                    doc.moveDown(0.2);
                    const addOnName = typeof addOn === 'string' ? addOn : addOn?.name;
                    const addOnPrice = typeof addOn === 'object' ? addOn?.price : 0;
                    if (addOnName) {
                        doc.fontSize(8).text(`  + ${addOnName}${addOnPrice ? ` (₹${addOnPrice})` : ''}`, 60);
                    }
                }
                doc.fontSize(10);
            }
            doc.moveDown(0.5);
        }
        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown(0.5);
        doc.font('Helvetica');
        doc.text(`Subtotal:`, 320, doc.y, { width: 80, align: 'right', continued: true });
        doc.text(`  ₹${Number(invoice.subtotal).toFixed(2)}`, { align: 'right' });
        if (invoice.taxAmount > 0) {
            doc.text(`Tax:`, 320, doc.y, { width: 80, align: 'right', continued: true });
            doc.text(`  ₹${Number(invoice.taxAmount).toFixed(2)}`, { align: 'right' });
        }
        doc.moveDown(0.3);
        doc.font('Helvetica-Bold').fontSize(12);
        doc.text(`Grand Total:`, 320, doc.y, { width: 80, align: 'right', continued: true });
        doc.text(`  ₹${Number(invoice.grandTotal).toFixed(2)}`, { align: 'right' });
        doc.moveDown(2);
        doc.fontSize(9).font('Helvetica').text('Thank you for your order!', { align: 'center' });
        doc.text('Powered by MenuMeets', { align: 'center' });
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