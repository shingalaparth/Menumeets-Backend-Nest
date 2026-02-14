import { Module } from '@nestjs/common';
import { InvoiceController } from './presentation/invoice.controller';
import { InvoiceService } from './application/invoice.service';
import { InvoicePrismaRepository } from './infrastructure/invoice.prisma.repository';
import { INVOICE_REPOSITORY } from './domain/invoice.repository';

@Module({
    imports: [],
    controllers: [InvoiceController],
    providers: [
        InvoiceService,
        {
            provide: INVOICE_REPOSITORY,
            useClass: InvoicePrismaRepository
        }
    ],
    exports: [InvoiceService] // Needed by Captain/Order modules
})
export class InvoiceModule { }
