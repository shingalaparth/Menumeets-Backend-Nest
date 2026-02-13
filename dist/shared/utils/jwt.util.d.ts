export interface JwtPayload {
    id: string;
    role?: string;
    [key: string]: unknown;
}
export declare function createJWT(payload: JwtPayload, secret: string, expiresIn?: string): string;
export declare function verifyJWT(token: string, secret: string): JwtPayload;
