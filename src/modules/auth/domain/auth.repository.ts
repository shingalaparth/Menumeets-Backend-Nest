/**
 * Auth Repository Interface — Domain layer
 * Abstracts token generation and password operations.
 * The infrastructure layer provides the concrete JWT + bcrypt implementation.
 */

export const AUTH_REPOSITORY = Symbol('AUTH_REPOSITORY');

export interface AuthRepository {
    /** Create a signed JWT from a payload */
    createToken(payload: Record<string, any>, expiresIn: string): string;

    /** Verify a JWT and return the decoded payload, or null if invalid */
    verifyToken(token: string): Record<string, any> | null;

    /** Hash a plain-text password */
    hashPassword(plain: string): Promise<string>;

    /** Compare a plain-text password against a hash */
    comparePassword(plain: string, hashed: string): Promise<boolean>;
}
