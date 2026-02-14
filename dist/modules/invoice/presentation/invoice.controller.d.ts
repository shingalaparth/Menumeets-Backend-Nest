import { InvoiceService } from '../application/invoice.service';
export declare class InvoiceController {
    private readonly invoiceService;
    constructor(invoiceService: InvoiceService);
    downloadInvoice(invoiceNumber: string, res: any): Promise<null>;
}
