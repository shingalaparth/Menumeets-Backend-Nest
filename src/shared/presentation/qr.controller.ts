import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { QrService } from '../services/qr.service';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { UniversalAuthGuard } from '../guards/universal-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('qr')
export class QrController {
    constructor(
        private qrService: QrService,
        private prisma: PrismaService
    ) { }

    /**
     * Generate QR for a specific table
     * GET /qr/table/:shopId/:tableId
     */
    @Get('table/:shopId/:tableId')
    @UseGuards(UniversalAuthGuard, RolesGuard)
    @Roles('vendor', 'admin', 'franchise_owner')
    async getTableQR(
        @Param('shopId') shopId: string,
        @Param('tableId') tableId: string
    ) {
        const table = await this.prisma.table.findUnique({ where: { id: tableId } });
        const qrCode = await this.qrService.generateTableQR(
            shopId, tableId, table?.tableNumber || undefined
        );
        return { shopId, tableId, tableNumber: table?.tableNumber, qrCode };
    }

    /**
     * Generate QRs for all tables in a shop
     * GET /qr/shop/:shopId
     */
    @Get('shop/:shopId')
    @UseGuards(UniversalAuthGuard, RolesGuard)
    @Roles('vendor', 'admin', 'franchise_owner')
    async getShopQRs(@Param('shopId') shopId: string) {
        const tables = await this.prisma.table.findMany({
            where: { shopId },
            select: { id: true, tableNumber: true }
        });
        const qrCodes = await this.qrService.generateBulkQR(tables, shopId);
        return { shopId, count: qrCodes.length, tables: qrCodes };
    }
}
