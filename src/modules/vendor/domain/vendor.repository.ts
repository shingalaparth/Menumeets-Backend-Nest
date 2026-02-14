/**
 * Vendor Repository Interface — Domain layer
 * Abstract contract for vendor data operations.
 */
import { VendorEntity, CreateVendorData, VendorActivityLogEntity } from './vendor.entity';

export const VENDOR_REPOSITORY = Symbol('VENDOR_REPOSITORY');

export interface VendorRepository {
    // Queries
    findById(id: string): Promise<VendorEntity | null>;
    findByEmail(email: string): Promise<VendorEntity | null>;
    findByEmailOrPhone(email: string, phone: string): Promise<VendorEntity | null>;
    findStaffByOwner(ownerId: string): Promise<VendorEntity[]>;
    findAll(): Promise<Partial<VendorEntity>[]>;

    // Mutations
    create(data: CreateVendorData): Promise<VendorEntity>;
    update(id: string, data: Partial<VendorEntity>): Promise<VendorEntity>;
    delete(id: string): Promise<void>;

    // Activity Logs
    createActivityLog(data: {
        vendorId: string;
        action: string;
        details?: string;
        ip?: string;
        device?: string;
    }): Promise<void>;
    findActivityLogs(vendorId: string, limit?: number): Promise<VendorActivityLogEntity[]>;
}
