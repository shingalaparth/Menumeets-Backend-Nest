import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { SystemService } from '../application/system.service';
import { UniversalAuthGuard } from '../../../shared/guards/universal-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';

@Controller('system')
export class SystemController {
    constructor(private readonly service: SystemService) { }

    @Get('payment-config')
    @UseGuards(UniversalAuthGuard, RolesGuard)
    @Roles('admin', 'manager')
    async getPaymentConfig() {
        return this.service.getPaymentConfig();
    }

    @Patch('payment-config')
    @UseGuards(UniversalAuthGuard, RolesGuard)
    @Roles('admin')
    async updatePaymentConfig(@CurrentUser() user: any, @Body() body: any) {
        return this.service.updatePaymentConfig(user.userId || user.vendorId, body);
    }

    @Get('public-payment-config')
    async getPublicPaymentConfig() {
        return {
            success: true,
            data: await this.service.getPublicPaymentConfig()
        };
    }
}
