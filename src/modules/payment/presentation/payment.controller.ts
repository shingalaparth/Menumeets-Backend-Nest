import { Controller, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { PaymentService } from '../application/payment.service';
import { UserAuthGuard } from '../../../shared/guards/user-auth.guard';
import { VendorAuthGuard } from '../../../shared/guards/vendor-auth.guard';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    // Onboard Vendor
    @Post('vendor/:shopId')
    @UseGuards(VendorAuthGuard)
    async createVendor(@Param('shopId') shopId: string, @Body() body: any, @CurrentUser() vendor: any) {
        return this.paymentService.createVendor(shopId, body, vendor);
    }

    // Create Payment Order (User)
    @Post('create-order')
    @UseGuards(UserAuthGuard)
    async createPaymentOrder(@CurrentUser() user: any, @Body() body: any) {
        return this.paymentService.createPaymentOrder(user.id, body.orderId);
    }

    // Verify Payment (User)
    @Post('verify')
    async verifyPayment(@Body() body: any) {
        return this.paymentService.verifyPayment(body.orderId);
    }

    // Webhook (No Guard)
    @Post('webhook')
    async handleWebhook(@Req() req: any) {
        // Implementation TODO
        return { status: 'OK' };
    }
}
