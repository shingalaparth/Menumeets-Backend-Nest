import { UserService } from '../../user/application/user.service';
import { VendorService } from '../../vendor/application/vendor.service';
import { AuthRepository } from '../domain/auth.repository';
import { UserAuthResult, VendorAuthResult, ShopVendorAuthResult } from '../domain/auth.entity';
export declare class AuthService {
    private authRepo;
    private userService;
    private vendorService;
    constructor(authRepo: AuthRepository, userService: UserService, vendorService: VendorService);
    registerOrLoginUser(phone: string, name?: string): Promise<UserAuthResult>;
    loginVendor(email: string, password: string): Promise<VendorAuthResult>;
    registerVendor(name: string, email: string, phone: string, password: string): Promise<VendorAuthResult>;
    registerShopAndVendor(vendorName: string, email: string, phone: string, password: string, shopName: string, foodCourtId?: string): Promise<ShopVendorAuthResult>;
}
