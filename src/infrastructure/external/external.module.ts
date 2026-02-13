/**
 * External Module — Groups all external service integrations
 * Exports: CloudinaryService, CashfreeService
 */
import { Global, Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CashfreeService } from './cashfree.service';

@Global()
@Module({
    providers: [CloudinaryService, CashfreeService],
    exports: [CloudinaryService, CashfreeService],
})
export class ExternalModule { }
