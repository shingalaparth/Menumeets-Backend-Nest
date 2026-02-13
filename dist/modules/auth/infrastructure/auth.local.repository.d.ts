import { ConfigService } from '@nestjs/config';
import { AuthRepository } from '../domain/auth.repository';
export declare class AuthLocalRepository implements AuthRepository {
    private configService;
    private readonly secret;
    constructor(configService: ConfigService);
    createToken(payload: Record<string, any>, expiresIn: string): string;
    verifyToken(token: string): Record<string, any> | null;
    hashPassword(plain: string): Promise<string>;
    comparePassword(plain: string, hashed: string): Promise<boolean>;
}
