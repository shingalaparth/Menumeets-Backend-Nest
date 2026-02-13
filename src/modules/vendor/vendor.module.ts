import { Module } from '@nestjs/common';
import { VendorService } from './application/vendor.service';
import { VendorController } from './presentation/vendor.controller';
import { VENDOR_REPOSITORY } from './domain/vendor.repository';
import { VendorPrismaRepository } from './infrastructure/vendor.prisma.repository';

@Module({
    controllers: [VendorController],
    providers: [
        VendorService,
        {
            provide: VENDOR_REPOSITORY,
            useClass: VendorPrismaRepository,
        },
    ],
    exports: [VendorService], // Auth module needs VendorService
})
export class VendorModule { }
