export interface AuthResult {
    message: string;
    token: string;
}
export interface UserAuthResult extends AuthResult {
    user: {
        id: string;
        name: string;
        phone: string;
    };
}
export interface VendorAuthResult extends AuthResult {
    data: {
        id: string;
        name: string;
        email: string;
        role: string;
        managesFoodCourt?: string | null;
    };
}
export interface ShopVendorAuthResult {
    message: string;
    data: {
        vendor: {
            id: string;
            name: string;
        };
        shop: {
            name: string;
            status: string;
        };
    };
}
export interface UserTokenPayload {
    id: string;
    phone: string;
}
export interface VendorTokenPayload {
    id: string;
    role: string;
}
