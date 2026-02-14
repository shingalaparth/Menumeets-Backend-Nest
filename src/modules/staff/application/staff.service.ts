import { Injectable, Inject, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { VENDOR_REPOSITORY, VendorRepository } from '../../vendor/domain/vendor.repository';
// import { VendorService } from '../../vendor/application/vendor.service'; // Start distinct or reuse?
// Staff management is essentially Vendor management with constrained roles.
import { hashPassword } from '../../../shared/utils/hash.util';

@Injectable()
export class StaffService {
    constructor(
        @Inject(VENDOR_REPOSITORY) private vendorRepo: VendorRepository
    ) { }

    async getStaffMembers(ownerId: string) {
        // Find vendors who have this owner as parentVendor
        // The interface defines findStaffByOwner, let's assume it's implemented in Prisma Repo.
        return this.vendorRepo.findStaffByOwner(ownerId);
    }

    async createStaffMember(ownerId: string, data: any) {
        const { name, email, number, password, role, shopId } = data;

        if (!name || !email || !number || !password || !role) {
            throw new BadRequestException('All fields (name, email, number, password, role) are required');
        }

        if (!['cashier', 'manager'].includes(role)) {
            throw new BadRequestException('Invalid role. Only cashier or manager allowed.');
        }

        // Check duplicates
        const existing = await this.vendorRepo.findByEmailOrPhone(email, number);
        if (existing) {
            throw new BadRequestException('Staff with this email or phone already exists');
        }

        const hashedPassword = await hashPassword(password);

        // Create
        return this.vendorRepo.create({
            name,
            email,
            phone: number,
            password: hashedPassword,
            role,
            parentVendorId: ownerId,
            managesShop: shopId || null,
            // Defaults
            isPhoneVerified: true, // Auto-verify staff created by owner?
            isEmailVerified: true
        } as any); // Type cast until Entity is fully updated with all fields
    }

    async deleteStaffMember(ownerId: string, staffId: string) {
        const staff = await this.vendorRepo.findById(staffId);
        if (!staff) throw new NotFoundException('Staff member not found');

        if (staff.parentVendorId !== ownerId) {
            throw new ForbiddenException('You can only delete your own staff members');
        }

        await this.vendorRepo.delete(staffId);
        return { message: 'Staff member removed successfully' };
    }
}
