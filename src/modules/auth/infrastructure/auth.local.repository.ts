/**
 * Auth Local Repository — Infrastructure layer
 * Concrete implementation of AuthRepository using jsonwebtoken + bcryptjs.
 */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthRepository } from '../domain/auth.repository';
import { createJWT, verifyJWT, JwtPayload } from '../../../shared/utils/jwt.util';
import { hashPassword, comparePassword } from '../../../shared/utils/hash.util';

@Injectable()
export class AuthLocalRepository implements AuthRepository {
    private readonly secret: string;

    constructor(private configService: ConfigService) {
        this.secret = this.configService.get<string>('jwt.secret', '');
    }

    createToken(payload: Record<string, any>, expiresIn: string): string {
        return createJWT(payload as JwtPayload, this.secret, expiresIn);
    }

    verifyToken(token: string): Record<string, any> | null {
        try {
            return verifyJWT(token, this.secret) as Record<string, any>;
        } catch {
            return null;
        }
    }

    async hashPassword(plain: string): Promise<string> {
        return hashPassword(plain);
    }

    async comparePassword(plain: string, hashed: string): Promise<boolean> {
        return comparePassword(plain, hashed);
    }
}
