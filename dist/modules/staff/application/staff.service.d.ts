import { VendorRepository } from '../../vendor/domain/vendor.repository';
export declare class StaffService {
    private vendorRepo;
    constructor(vendorRepo: VendorRepository);
    getStaffMembers(ownerId: string): Promise<import("../../vendor/domain/vendor.entity").VendorEntity[]>;
    createStaffMember(ownerId: string, data: any): Promise<import("../../vendor/domain/vendor.entity").VendorEntity>;
    deleteStaffMember(ownerId: string, staffId: string): Promise<{
        message: string;
    }>;
}
