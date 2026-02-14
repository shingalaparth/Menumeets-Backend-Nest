/**
 * Table Controller
 * Migrated from table.routes.js + table.controller.js
 */
import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    UseGuards,
} from '@nestjs/common';
import { VendorAuthGuard } from '../../../shared/guards/vendor-auth.guard';
import { CurrentVendor } from '../../../shared/decorators/current-user.decorator';
import { TableService } from '../application/table.service';

@Controller('shops/:shopId/tables') // Note the prefix structure
@UseGuards(VendorAuthGuard)
export class TableController {
    constructor(private tableService: TableService) { }

    @Post()
    createTable(@Param('shopId') shopId: string, @CurrentVendor() vendor: any, @Body() body: any) {
        return this.tableService.createTable(shopId, vendor, body);
    }

    @Get()
    getTables(@Param('shopId') shopId: string, @CurrentVendor() vendor: any) {
        return this.tableService.getTablesForShop(shopId, vendor);
    }

    @Delete('all')
    deleteAllTables(@Param('shopId') shopId: string, @CurrentVendor() vendor: any) {
        return this.tableService.deleteAllTables(shopId, vendor);
    }

    @Patch(':qrIdentifier')
    updateTable(@Param('shopId') shopId: string, @Param('qrIdentifier') qr: string, @CurrentVendor() vendor: any, @Body() body: any) {
        return this.tableService.updateTable(shopId, qr, vendor, body);
    }

    @Delete(':qrIdentifier')
    deleteTable(@Param('shopId') shopId: string, @Param('qrIdentifier') qr: string, @CurrentVendor() vendor: any) {
        return this.tableService.deleteTable(shopId, qr, vendor);
    }

    // ── Session Routes ──

    @Post('sessions/start')
    startSession(@Param('shopId') shopId: string, @CurrentVendor() vendor: any, @Body() body: any) {
        return this.tableService.startSession(shopId, vendor, body);
    }

    @Post('sessions/:sessionId/close')
    closeSession(@Param('shopId') shopId: string, @Param('sessionId') sessionId: string, @CurrentVendor() vendor: any) {
        return this.tableService.closeSession(shopId, sessionId, vendor);
    }

    @Get('sessions/:sessionId')
    getSession(@Param('shopId') shopId: string, @Param('sessionId') sessionId: string, @CurrentVendor() vendor: any) {
        return this.tableService.getSessionDetails(shopId, sessionId, vendor);
    }

    @Post('sessions/change')
    changeSession(@Param('shopId') shopId: string, @CurrentVendor() vendor: any, @Body() body: any) {
        return this.tableService.changeTableSession(shopId, vendor, body);
    }

    @Post('sessions/merge')
    mergeSession(@Param('shopId') shopId: string, @CurrentVendor() vendor: any, @Body() body: any) {
        return this.tableService.mergeTableSession(shopId, vendor, body);
    }

    @Post('sessions/unmerge')
    unmergeSession(@Param('shopId') shopId: string, @CurrentVendor() vendor: any, @Body() body: any) {
        return this.tableService.unmergeTableSession(shopId, vendor, body);
    }

    @Post('sessions/order')
    placeOrder(@Param('shopId') shopId: string, @CurrentVendor() vendor: any, @Body() body: any) {
        return this.tableService.placeTableOrder(shopId, vendor, body);
    }
}
