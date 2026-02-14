import { Controller, Get, Patch, Post, Param, Query, Req, Res, UseGuards, Body } from '@nestjs/common';
import { InvoiceService } from '../application/invoice.service';
import { UserAuthGuard } from '../../../shared/guards/user-auth.guard';
import { VendorAuthGuard } from '../../../shared/guards/vendor-auth.guard';
import { UniversalAuthGuard } from '../../../shared/guards/universal-auth.guard';
import { Response } from 'express';

@Controller('invoices')
export class InvoiceController {
    constructor(private invoiceService: InvoiceService) { }

    // ── Vendor: Shop Invoices ──
    @UseGuards(VendorAuthGuard)
    @Get('shop/:shopId')
    async getShopInvoices(
        @Param('shopId') shopId: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string
    ) {
        return this.invoiceService.getShopInvoices(shopId, parseInt(page || '1'), parseInt(limit || '20'));
    }

    // ── User: My Invoices ──
    @UseGuards(UserAuthGuard)
    @Get('my')
    async getMyInvoices(@Req() req: any) {
        return this.invoiceService.getMyInvoices(req.user.sub);
    }

    // ── Get Invoice by ID ──
    @UseGuards(UniversalAuthGuard)
    @Get(':id')
    async getInvoiceById(@Param('id') id: string) {
        return this.invoiceService.getInvoiceById(id);
    }

    // ── Update Invoice Status ──
    @UseGuards(VendorAuthGuard)
    @Patch(':id/status')
    async updateInvoiceStatus(
        @Param('id') id: string,
        @Body('status') status: string
    ) {
        return this.invoiceService.updateInvoiceStatus(id, status);
    }

    // ── Download Invoice PDF by Invoice Number ──
    @UseGuards(UniversalAuthGuard)
    @Get('download/:invoiceNumber')
    async downloadInvoice(@Param('invoiceNumber') invoiceNumber: string, @Res() res: Response) {
        const invoice = await this.invoiceService.getInvoiceByNumber(invoiceNumber);
        return this.invoiceService.generateInvoicePDF(invoice, res);
    }

    // ── Download Invoice PDF by Order ID ──
    @UseGuards(UniversalAuthGuard)
    @Get('order/:orderId/download')
    async downloadInvoiceByOrder(@Param('orderId') orderId: string, @Res() res: Response) {
        const invoice = await this.invoiceService.getInvoiceByOrderId(orderId);
        return this.invoiceService.generateInvoicePDF(invoice, res);
    }

    // ── Generate Invoice from Parent Order ──
    @UseGuards(VendorAuthGuard)
    @Post('from-parent-order/:orderId')
    async generateInvoiceFromParentOrder(@Param('orderId') orderId: string) {
        // This needs the full parent order with subOrders
        // The service handles fetching and creation
        return this.invoiceService.generateInvoiceFromParentOrder({ id: orderId });
    }
}
