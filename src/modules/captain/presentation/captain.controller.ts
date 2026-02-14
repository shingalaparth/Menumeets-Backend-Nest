import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { CaptainService } from '../application/captain.service';
import { CaptainAuthGuard } from '../../../shared/guards/captain-auth.guard';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';

@Controller('captain')
export class CaptainController {
    constructor(private readonly captainService: CaptainService) { }

    @Post('login')
    async login(@Body() body: any) {
        return this.captainService.login(body.shopId, body.pin);
    }

    @Get('tables')
    @UseGuards(CaptainAuthGuard)
    async getDashboard(@CurrentUser() shop: any) {
        return this.captainService.getDashboard(shop.id);
    }

    @Post('session/start')
    @UseGuards(CaptainAuthGuard)
    async startSession(@CurrentUser() shop: any, @Body() body: any) {
        return this.captainService.startSession(shop.id, body);
    }

    @Post('session/close')
    @UseGuards(CaptainAuthGuard)
    async closeSession(@CurrentUser() shop: any, @Body() body: any) {
        return this.captainService.closeSession(shop.id, body.sessionId, body.paymentMethod);
    }
}
