import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { StaffService } from '../application/staff.service';
import { VendorAuthGuard } from '../../../shared/guards/vendor-auth.guard';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';

@Controller('staff')
@UseGuards(VendorAuthGuard)
export class StaffController {
    constructor(private readonly staffService: StaffService) { }

    @Get()
    async getStaffMembers(@CurrentUser() vendor: any) {
        return this.staffService.getStaffMembers(vendor.id);
    }

    @Post()
    async createStaffMember(@CurrentUser() vendor: any, @Body() body: any) {
        return this.staffService.createStaffMember(vendor.id, body);
    }

    @Delete(':id')
    async deleteStaffMember(@CurrentUser() vendor: any, @Param('id') id: string) {
        return this.staffService.deleteStaffMember(vendor.id, id);
    }
}
