import { Module } from '@nestjs/common';
import { StaffController } from './presentation/staff.controller';
import { StaffService } from './application/staff.service';
import { VendorModule } from '../vendor/vendor.module';

@Module({
    imports: [VendorModule],
    controllers: [StaffController],
    providers: [StaffService],
    exports: [StaffService]
})
export class StaffModule { }
