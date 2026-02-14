import { VendorEntity, CreateVendorData, VendorActivityLogEntity } from './vendor.entity';
export declare const VENDOR_REPOSITORY: unique symbol;
export interface VendorRepository {
    findById(id: string): Promise<VendorEntity | null>;
    findByEmail(email: string): Promise<VendorEntity | null>;
    findByEmailOrPhone(email: string, phone: string): Promise<VendorEntity | null>;
    findStaffByOwner(ownerId: string): Promise<VendorEntity[]>;
    findAll(): Promise<Partial<VendorEntity>[]>;
    create(data: CreateVendorData): Promise<VendorEntity>;
    update(id: string, data: Partial<VendorEntity>): Promise<VendorEntity>;
    delete(id: string): Promise<void>;
    createActivityLog(data: {
        vendorId: string;
        action: string;
        details?: string;
        ip?: string;
        device?: string;
    }): Promise<void>;
    findActivityLogs(vendorId: string, limit?: number): Promise<VendorActivityLogEntity[]>;
}
