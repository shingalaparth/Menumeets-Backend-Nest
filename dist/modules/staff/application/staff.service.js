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
exports.StaffService = void 0;
const common_1 = require("@nestjs/common");
const vendor_repository_1 = require("../../vendor/domain/vendor.repository");
const hash_util_1 = require("../../../shared/utils/hash.util");
let StaffService = class StaffService {
    constructor(vendorRepo) {
        this.vendorRepo = vendorRepo;
    }
    async getStaffMembers(ownerId) {
        return this.vendorRepo.findStaffByOwner(ownerId);
    }
    async createStaffMember(ownerId, data) {
        const { name, email, number, password, role, shopId } = data;
        if (!name || !email || !number || !password || !role) {
            throw new common_1.BadRequestException('All fields (name, email, number, password, role) are required');
        }
        if (!['cashier', 'manager'].includes(role)) {
            throw new common_1.BadRequestException('Invalid role. Only cashier or manager allowed.');
        }
        const existing = await this.vendorRepo.findByEmailOrPhone(email, number);
        if (existing) {
            throw new common_1.BadRequestException('Staff with this email or phone already exists');
        }
        const hashedPassword = await (0, hash_util_1.hashPassword)(password);
        return this.vendorRepo.create({
            name,
            email,
            phone: number,
            password: hashedPassword,
            role,
            parentVendorId: ownerId,
            managesShop: shopId || null,
            isPhoneVerified: true,
            isEmailVerified: true
        });
    }
    async deleteStaffMember(ownerId, staffId) {
        const staff = await this.vendorRepo.findById(staffId);
        if (!staff)
            throw new common_1.NotFoundException('Staff member not found');
        if (staff.parentVendorId !== ownerId) {
            throw new common_1.ForbiddenException('You can only delete your own staff members');
        }
        await this.vendorRepo.delete(staffId);
        return { message: 'Staff member removed successfully' };
    }
};
exports.StaffService = StaffService;
exports.StaffService = StaffService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(vendor_repository_1.VENDOR_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], StaffService);
//# sourceMappingURL=staff.service.js.map