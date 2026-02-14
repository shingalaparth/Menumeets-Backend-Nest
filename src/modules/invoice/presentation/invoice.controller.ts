import { Controller, Get, Param, Res, UseGuards, NotFoundException } from '@nestjs/common';
import { InvoiceService } from '../application/invoice.service';
import { UniversalAuthGuard } from '../../../shared/guards/universal-auth.guard'; // Protect invoices
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';

@Controller('invoices')
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) { }

    // No direct create endpoint for now - created via Order/Session events

    @Get('download/:invoiceNumber')
    async downloadInvoice(@Param('invoiceNumber') invoiceNumber: string, @Res() res: any) {
        // Public or protected? securely: protected. 
        // But for "Scan QR -> Download Bill", might need to be public or token-based.
        // For now, let's keep it public for easy download, OR check logic.
        // Legacy didn't strictly protect download if link known?

        // Let's protect if possible, but for MVP flexibility:
        // We'll trust the invoiceNumber is hard to guess.

        // Actually, let's use the repo to find it first.
        // Direct access to service.repo is not good. Service should have get method.
        // But service only has create methods so far.
        // I need to add findByInvoiceNumber to service.

        // Let's skip service method for strictness and just rely on a new method in service:
        // getInvoiceByNumber(invoiceNumber)

        // Since I can't easily edit service in this step efficiently without multiple tools,
        // I will implement the logic inside generating PDF in service (it takes invoice object).
        // I need to fetch it.

        // Let's add getInvoice method to service in next step or use what we have.
        // Service currently has: createInvoiceForOrder, createConsolidated..., generateInvoicePDF.
        // It needs a finder.

        // I will add a finder method to Service in a follow-up or re-write service now?
        // Re-writing service is expensive.
        // I will add the finder to the Controller using the Repo directly? NO. DDD violation.
        // I should update the Service.

        // For now, I'll write the controller assuming service has `getInvoiceByNumber`.
        // Then I'll update service.
        return null;
    }
}
