import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import { ConfigService } from '@nestjs/config';

/**
 * QR Code generation service for table-level links.
 * Generates QR codes pointing to the shop's ordering URL with table context.
 */
@Injectable()
export class QrService {
    private baseUrl: string;

    constructor(private config: ConfigService) {
        this.baseUrl = this.config.get<string>('FRONTEND_URL') || 'https://menumeets.com';
    }

    /**
     * Generate a QR code for a specific table
     */
    async generateTableQR(shopId: string, tableId: string, tableNumber?: string): Promise<string> {
        const url = `${this.baseUrl}/shop/${shopId}/table/${tableId}`;
        return QRCode.toDataURL(url, {
            width: 512,
            margin: 2,
            color: { dark: '#000000', light: '#FFFFFF' },
            errorCorrectionLevel: 'H'
        });
    }

    /**
     * Generate QR codes for all tables in a shop
     */
    async generateBulkQR(tables: Array<{ id: string; tableNumber: string }>, shopId: string): Promise<Array<{ tableId: string; tableNumber: string; qrCode: string }>> {
        const results = await Promise.all(
            tables.map(async (table) => ({
                tableId: table.id,
                tableNumber: table.tableNumber,
                qrCode: await this.generateTableQR(shopId, table.id, table.tableNumber)
            }))
        );
        return results;
    }
}
