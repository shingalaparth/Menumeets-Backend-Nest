import { StaffService } from '../application/staff.service';
export declare class StaffController {
    private readonly staffService;
    constructor(staffService: StaffService);
    getStaffMembers(vendor: any): Promise<import("../../vendor/domain/vendor.entity").VendorEntity[]>;
    createStaffMember(vendor: any, body: any): Promise<import("../../vendor/domain/vendor.entity").VendorEntity>;
    deleteStaffMember(vendor: any, id: string): Promise<{
        message: string;
    }>;
}
