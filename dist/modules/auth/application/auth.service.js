"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../../user/application/user.service");
const vendor_service_1 = require("../../vendor/application/vendor.service");
const auth_repository_1 = require("../domain/auth.repository");
let AuthService = class AuthService {
    constructor(authRepo, userService, vendorService) {
        this.authRepo = authRepo;
        this.userService = userService;
        this.vendorService = vendorService;
    }
    async registerOrLoginUser(phone, name) {
        if (!phone) {
            throw new common_1.BadRequestException('Phone number is required.');
        }
        let user = await this.userService.findByPhone(phone);
        let isNew = false;
        if (!user) {
            if (!name) {
                throw new common_1.BadRequestException('Name is required for new registration.');
            }
            user = await this.userService.create({ name, phone });
            isNew = true;
        }
        const token = this.authRepo.createToken({ id: user.id, phone: user.phone }, '3h');
        return {
            message: isNew ? 'Registration successful!' : 'Login successful!',
            token,
            user: { id: user.id, name: user.name, phone: user.phone },
        };
    }
    async loginVendor(email, password) {
        if (!email || !password) {
            throw new common_1.BadRequestException('Email and password are required');
        }
        const emailLower = email.toLowerCase();
        const vendor = await this.vendorService.findByEmail(emailLower);
        if (!vendor) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isMatch = await this.authRepo.comparePassword(password, vendor.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const token = this.authRepo.createToken({ id: vendor.id, role: vendor.role }, '7d');
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
    async registerVendor(name, email, phone, password) {
        if (!name || !email || !phone || !password) {
            throw new common_1.BadRequestException('Please provide all required fields.');
        }
        const emailLower = email.toLowerCase();
        const exists = await this.vendorService.findByEmailOrPhone(emailLower, phone);
        if (exists) {
            throw new common_1.BadRequestException('A user with this email or phone number already exists.');
        }
        const newVendor = await this.vendorService.create({
            name,
            email: emailLower,
            phone,
            password,
        });
        const token = this.authRepo.createToken({ id: newVendor.id, role: newVendor.role }, '7d');
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
    async registerShopAndVendor(vendorName, email, phone, password, shopName, foodCourtId) {
        if (!vendorName || !email || !phone || !password || !shopName) {
            throw new common_1.BadRequestException('Please provide all required fields.');
        }
        const emailLower = email.toLowerCase();
        const exists = await this.vendorService.findByEmailOrPhone(emailLower, phone);
        if (exists) {
            throw new common_1.BadRequestException('A user with this email or phone number already exists.');
        }
        const newVendor = await this.vendorService.create({
            name: vendorName,
            email: emailLower,
            phone,
            password,
        });
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(auth_repository_1.AUTH_REPOSITORY)),
    __metadata("design:paramtypes", [Object, user_service_1.UserService,
        vendor_service_1.VendorService])
], AuthService);
//# sourceMappingURL=auth.service.js.map