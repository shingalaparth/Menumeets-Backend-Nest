/**
 * JWT Utility — migrated from old utils/jwt.js
 * Provides standalone JWT create/verify functions.
 * Note: NestJS @nestjs/jwt is preferred for DI-based usage,
 * but these helpers remain useful for quick token ops outside services.
 */
import * as jwt from 'jsonwebtoken';

export interface JwtPayload {
    id: string;
    role?: string;
    [key: string]: unknown;
}

export function createJWT(
    payload: JwtPayload,
    secret: string,
    expiresIn: string = '7d',
): string {
    return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
}

export function verifyJWT(token: string, secret: string): JwtPayload {
    return jwt.verify(token, secret) as JwtPayload;
}
