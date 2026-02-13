export interface VendorPersonalInfo {
    avatar?: {
        url: string;
        publicId: string;
    };
    altPhone?: string;
    gender?: string;
    dob?: string;
}
export interface VendorKyc {
    aadhaarNumber?: string;
    panNumber?: string;
    aadhaarFrontImage?: {
        url: string;
        publicId: string;
    };
    aadhaarBackImage?: {
        url: string;
        publicId: string;
    };
    panImage?: {
        url: string;
        publicId: string;
    };
    signatureImage?: {
        url: string;
        publicId: string;
    };
    status?: string;
    rejectionReason?: string;
}
export interface VendorBankDetails {
    accountHolderName?: string;
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
    branch?: string;
    upiId?: string;
    cancelledChequeImage?: {
        url: string;
        publicId: string;
    };
    passbookImage?: {
        url: string;
        publicId: string;
    };
    status?: string;
    rejectionReason?: string;
}
export interface VendorEntity {
    id: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    parentVendorId?: string | null;
    managesFoodCourt?: string | null;
    managesShop?: string | null;
    personalInfo?: VendorPersonalInfo | null;
    kyc?: VendorKyc | null;
    bankDetails?: VendorBankDetails | null;
    franchiseRoles?: any | null;
    notificationPreferences?: any | null;
    security?: any | null;
    permissions?: any | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateVendorData {
    name: string;
    email: string;
    phone: string;
    password: string;
}
export interface VendorActivityLogEntity {
    id: string;
    vendorId: string;
    action: string;
    details?: string | null;
    metadata?: any | null;
    ip?: string | null;
    device?: string | null;
    browser?: string | null;
    createdAt: Date;
}
