/**
 * Auth Controller — migrated from old auth.controller.js + auth.routes.js
 *
 * Old routes:
 *   POST /api/users/login           → registerOrLoginUser
 *   POST /api/vendor/login          → loginVendor
 *   POST /api/vendor/register       → registerVendor
 *   POST /api/register/shop-vendor  → registerShopAndVendor
 */
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../application/auth.service';

@Controller()
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('users/login')
    async registerOrLoginUser(@Body() body: { phone: string; name?: string }) {
        return this.authService.registerOrLoginUser(body.phone, body.name);
    }

    @Post('vendor/login')
    async loginVendor(@Body() body: { email: string; password: string }) {
        return this.authService.loginVendor(body.email, body.password);
    }

    @Post('vendor/register')
    async registerVendor(
        @Body() body: { name: string; email: string; number: string; password: string },
    ) {
        return this.authService.registerVendor(body.name, body.email, body.number, body.password);
    }

    @Post('register/shop-vendor')
    async registerShopAndVendor(
        @Body() body: {
            vendorName: string;
            email: string;
            number: string;
            password: string;
            shopName: string;
            foodCourtId?: string;
        },
    ) {
        return this.authService.registerShopAndVendor(
            body.vendorName,
            body.email,
            body.number,
            body.password,
            body.shopName,
            body.foodCourtId,
        );
    }
}
