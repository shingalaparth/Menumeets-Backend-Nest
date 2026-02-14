export interface ShopProfileSettings {
    logo?: {
        url: string;
        publicId: string;
    };
    coverImage?: {
        url: string;
        publicId: string;
    };
    displayEmail?: string;
    displayPhone?: string;
    fssai?: string;
    gstin?: string;
    openingTime?: string;
    closingTime?: string;
    offDays?: string[];
    isTemporarilyClosed?: boolean;
    autoReopenDate?: string;
    serviceModes?: {
        dining?: boolean;
        delivery?: boolean;
        pickup?: boolean;
    };
    platformCommission?: number;
}
export interface ShopTaxSettings {
    isGstEnabled?: boolean;
    gstNumber?: string;
    gstPercentage?: number;
}
export interface ShopFeatureFlags {
    [key: string]: boolean | undefined;
}
export interface ShopSettings {
    profile?: ShopProfileSettings;
    tax?: ShopTaxSettings;
    featureAccess?: ShopFeatureFlags;
    featureEntitlements?: ShopFeatureFlags;
    quickAccess?: string[];
    orientationMode?: 'auto' | 'portrait' | 'landscape';
}
export interface ShopFranchisePolicy {
    enforceMenuTemplate?: boolean;
    allowLocalPricing?: boolean;
}
export interface ShopSoundPreferences {
    playInDashboard?: boolean;
    playInKOT?: boolean;
    volume?: number;
}
export interface ShopEntity {
    id: string;
    name: string;
    address: string;
    phone: string;
    businessType: string;
    isActive: boolean;
    status: string;
    ownerId: string;
    franchiseId?: string | null;
    foodCourtId?: string | null;
    region?: string | null;
    captainPin?: string | null;
    kotPin?: string | null;
    upiQrCodeUrl?: string | null;
    cashfreeVendorId?: string | null;
    cashfreeOnboardingStatus: string;
    settings?: ShopSettings | null;
    franchisePolicy?: ShopFranchisePolicy | null;
    soundPreferences?: ShopSoundPreferences | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateShopData {
    name: string;
    address?: string;
    phone?: string;
    businessType?: string;
    ownerId: string;
    foodCourtId?: string;
}
