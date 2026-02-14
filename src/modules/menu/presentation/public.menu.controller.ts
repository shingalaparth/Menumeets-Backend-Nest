/**
 * Public Menu Controller
 * Handles public-facing menu access via QR code.
 * Migrated from public.menu.controller.js
 */
import {
    Controller,
    Get,
    Param,
} from '@nestjs/common';
import { MenuService } from '../application/menu.service';

@Controller('public/menu')
export class PublicMenuController {
    constructor(private menuService: MenuService) { }

    @Get(':qrIdentifier')
    async getMenuByQr(@Param('qrIdentifier') qrIdentifier: string) {
        return this.menuService.getMenuByQrIdentifier(qrIdentifier);
    }
}
