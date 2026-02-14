import { Controller, Post, Get, Patch, Body, Param, Req, UseGuards, Query } from '@nestjs/common';
import { CaptainService } from '../application/captain.service';
import { CaptainAuthGuard } from '../../../shared/guards/captain-auth.guard';

@Controller('captain')
export class CaptainController {
    constructor(private captainService: CaptainService) { }

    // ── Auth ──
    @Post('login')
    async login(@Body('shopId') shopId: string, @Body('pin') pin: string) {
        return this.captainService.login(shopId, pin);
    }

    // ── Dashboard ──
    @UseGuards(CaptainAuthGuard)
    @Get('dashboard')
    async getDashboard(@Req() req: any) {
        return this.captainService.getDashboard(req.user.sub);
    }

    // ── Sessions ──
    @UseGuards(CaptainAuthGuard)
    @Get('sessions/active')
    async getActiveSessions(@Req() req: any) {
        return this.captainService.getActiveSessions(req.user.sub);
    }

    @UseGuards(CaptainAuthGuard)
    @Get('sessions/history')
    async getSessionHistory(@Req() req: any, @Query('page') page: string) {
        return this.captainService.getSessionHistory(req.user.sub, parseInt(page || '1'), 20);
    }

    @UseGuards(CaptainAuthGuard)
    @Post('session/start')
    async startSession(@Req() req: any, @Body() body: any) {
        return this.captainService.startSession(req.user.sub, body);
    }

    @UseGuards(CaptainAuthGuard)
    @Post('session/close')
    async closeSession(@Req() req: any, @Body() body: any) {
        return this.captainService.closeSession(req.user.sub, body.sessionId, body.paymentMethod);
    }

    @UseGuards(CaptainAuthGuard)
    @Get('session/:sessionId')
    async getSessionDetails(@Req() req: any, @Param('sessionId') sessionId: string) {
        return this.captainService.getSessionDetails(req.user.sub, sessionId);
    }

    // ── Split Bill ──
    @UseGuards(CaptainAuthGuard)
    @Post('session/:sessionId/split-bill')
    async splitBill(
        @Req() req: any,
        @Param('sessionId') sessionId: string,
        @Body('splits') splits: number
    ) {
        return this.captainService.splitBill(req.user.sub, sessionId, splits);
    }

    // ── Print Bill ──
    @UseGuards(CaptainAuthGuard)
    @Get('session/:sessionId/print-bill')
    async printBill(@Req() req: any, @Param('sessionId') sessionId: string) {
        return this.captainService.printBill(req.user.sub, sessionId);
    }

    // ── Table Operations ──
    @UseGuards(CaptainAuthGuard)
    @Post('session/change-table')
    async changeTable(@Req() req: any, @Body() body: any) {
        return this.captainService.changeTable(req.user.sub, body.sessionId, body.newTableId);
    }

    @UseGuards(CaptainAuthGuard)
    @Post('session/merge')
    async mergeTables(@Req() req: any, @Body() body: any) {
        return this.captainService.mergeTables(req.user.sub, body.sessionId, body.tableIds);
    }

    // ── Waiter Call ──
    @UseGuards(CaptainAuthGuard)
    @Post('waiter-call')
    async callWaiter(@Req() req: any, @Body() body: any) {
        return this.captainService.callWaiter(req.user.sub, body.tableId, body.sessionId);
    }

    @UseGuards(CaptainAuthGuard)
    @Post('waiter-call/resolve')
    async resolveWaiterCall(@Req() req: any, @Body('callId') callId: string) {
        return this.captainService.resolveWaiterCall(req.user.sub, callId);
    }

    // ── Menu ──
    @UseGuards(CaptainAuthGuard)
    @Get('menu')
    async getMenu(@Req() req: any) {
        return this.captainService.getMenu(req.user.sub);
    }

    // ── Orders ──
    @UseGuards(CaptainAuthGuard)
    @Post('order')
    async placeOrder(@Req() req: any, @Body() body: any) {
        return this.captainService.placeOrder(req.user.sub, body);
    }

    @UseGuards(CaptainAuthGuard)
    @Post('order/void-item')
    async voidItem(@Req() req: any, @Body() body: any) {
        return this.captainService.voidItem(req.user.sub, body.orderId, body.itemId, body.reason);
    }

    @UseGuards(CaptainAuthGuard)
    @Patch('order/:orderId')
    async modifyOrder(@Req() req: any, @Param('orderId') orderId: string, @Body() body: any) {
        return this.captainService.modifyOrder(req.user.sub, orderId, body);
    }
}
