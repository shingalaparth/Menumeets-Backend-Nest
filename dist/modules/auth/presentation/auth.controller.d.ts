import { AuthService } from '../application/auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    registerOrLoginUser(body: {
        phone: string;
        name?: string;
    }): Promise<import("../domain/auth.entity").UserAuthResult>;
    loginVendor(body: {
        email: string;
        password: string;
    }): Promise<import("../domain/auth.entity").VendorAuthResult>;
    registerVendor(body: {
        name: string;
        email: string;
        number: string;
        password: string;
    }): Promise<import("../domain/auth.entity").VendorAuthResult>;
    registerShopAndVendor(body: {
        vendorName: string;
        email: string;
        number: string;
        password: string;
        shopName: string;
        foodCourtId?: string;
    }): Promise<import("../domain/auth.entity").ShopVendorAuthResult>;
}
