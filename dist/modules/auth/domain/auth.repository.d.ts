export declare const AUTH_REPOSITORY: unique symbol;
export interface AuthRepository {
    createToken(payload: Record<string, any>, expiresIn: string): string;
    verifyToken(token: string): Record<string, any> | null;
    hashPassword(plain: string): Promise<string>;
    comparePassword(plain: string, hashed: string): Promise<boolean>;
}
