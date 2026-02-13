/**
 * Auth Service — Application layer
 * Depends on AuthRepository (token/password ops) + UserService + VendorService.
 * Zero direct dependency on JWT library, bcrypt, or ConfigService.
 */
import {
    Injectable,
    Inject,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../user/application/user.service';
import { VendorService } from '../../vendor/application/vendor.service';
import { AUTH_REPOSITORY, AuthRepository } from '../domain/auth.repository';
import {
    UserAuthResult,
    VendorAuthResult,
    ShopVendorAuthResult,
} from '../domain/auth.entity';

@Injectable()
export class AuthService {
    constructor(
        @Inject(AUTH_REPOSITORY) private authRepo: AuthRepository,
        private userService: UserService,
        private vendorService: VendorService,
    ) { }

    /**
     * Register or Login a USER (Customer)
     * Old: POST /api/users/login
     */
    async registerOrLoginUser(phone: string, name?: string): Promise<UserAuthResult> {
        if (!phone) {
            throw new BadRequestException('Phone number is required.');
        }

        let user = await this.userService.findByPhone(phone);
        let isNew = false;

        if (!user) {
            if (!name) {
                throw new BadRequestException('Name is required for new registration.');
            }
            user = await this.userService.create({ name, phone });
            isNew = true;
        }

        const token = this.authRepo.createToken(
            { id: user.id, phone: user.phone },
            '3h',
        );

        return {
            message: isNew ? 'Registration successful!' : 'Login successful!',
            token,
            user: { id: user.id, name: user.name, phone: user.phone },
        };
    }

    /**
     * Login VENDOR
     * Old: POST /api/vendor/login
     */
    async loginVendor(email: string, password: string): Promise<VendorAuthResult> {
        if (!email || !password) {
            throw new BadRequestException('Email and password are required');
        }

        const emailLower = email.toLowerCase();
        const vendor = await this.vendorService.findByEmail(emailLower);

        if (!vendor) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await this.authRepo.comparePassword(password, vendor.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = this.authRepo.createToken(
            { id: vendor.id, role: vendor.role },
            '7d',
        );

        return {
            message: 'Login successful',
            token,
            data: {
                id: vendor.id,
                name: vendor.name,
                email: vendor.email,
                role: vendor.role,
                managesFoodCourt: vendor.managesFoodCourt,
            },
        };
    }

    /**
     * Register VENDOR Only (No Shop)
     * Old: POST /api/vendor/register
     */
    async registerVendor(
        name: string,
        email: string,
        phone: string,
        password: string,
    ): Promise<VendorAuthResult> {
        if (!name || !email || !phone || !password) {
            throw new BadRequestException('Please provide all required fields.');
        }

        const emailLower = email.toLowerCase();
        const exists = await this.vendorService.findByEmailOrPhone(emailLower, phone);
        if (exists) {
            throw new BadRequestException('A user with this email or phone number already exists.');
        }

        const newVendor = await this.vendorService.create({
            name,
            email: emailLower,
            phone,
            password,
        });

        const token = this.authRepo.createToken(
            { id: newVendor.id, role: newVendor.role },
            '7d',
        );

        return {
            message: 'Registration successful!',
            token,
            data: {
                id: newVendor.id,
                name: newVendor.name,
                email: newVendor.email,
                role: newVendor.role,
            },
        };
    }

    /**
     * Register Shop AND Vendor (Main Signup)
     * Old: POST /api/register/shop-vendor
     * Note: Shop creation deferred until Shop module is migrated.
     */
    async registerShopAndVendor(
        vendorName: string,
        email: string,
        phone: string,
        password: string,
        shopName: string,
        foodCourtId?: string,
    ): Promise<ShopVendorAuthResult> {
        if (!vendorName || !email || !phone || !password || !shopName) {
            throw new BadRequestException('Please provide all required fields.');
        }

        const emailLower = email.toLowerCase();
        const exists = await this.vendorService.findByEmailOrPhone(emailLower, phone);
        if (exists) {
            throw new BadRequestException('A user with this email or phone number already exists.');
        }

        const newVendor = await this.vendorService.create({
            name: vendorName,
            email: emailLower,
            phone,
            password,
        });

        // TODO: Create Shop when Shop module is migrated

        return {
            message: foodCourtId
                ? 'Registration successful! Your application has been submitted.'
                : 'Registration successful! You can now log in.',
            data: {
                vendor: { id: newVendor.id, name: newVendor.name },
                shop: { name: shopName, status: foodCourtId ? 'Pending' : 'Approved' },
            },
        };
    }
}
