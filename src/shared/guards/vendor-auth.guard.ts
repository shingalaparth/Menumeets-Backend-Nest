/**
 * Vendor JWT Auth Guard — migrated from old auth.middleware.js → protect()
 *
 * Old: Reads token from cookie/header, verifies JWT, finds Vendor in DB
 * New: NestJS CanActivate guard with same logic via Prisma
 */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { verifyJWT } from '../utils/jwt.util';

@Injectable()
export class VendorAuthGuard implements CanActivate {
    constructor(
        private configService: ConfigService,
        private prisma: PrismaService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractToken(request);

        if (!token) {
            throw new UnauthorizedException('Not authorized, token missing');
        }

        try {
            const secret = this.configService.get<string>('jwt.secret', '');
            const decoded = verifyJWT(token, secret);

            // Admin bypass (same as old middleware)
            if (decoded.role === 'admin') {
                request.vendor = { id: 'admin', role: 'admin', name: 'Administrator' };
                return true;
            }

            // Find vendor in DB via Prisma (model will be added when vendor module is migrated)
            // For now, attach decoded payload
            request.vendor = decoded;
            return true;
        } catch {
            throw new UnauthorizedException('Not authorized, invalid token');
        }
    }

    private extractToken(request: any): string | null {
        // 1. Cookie
        if (request.cookies?.token) return request.cookies.token;
        // 2. Bearer header
        const auth = request.headers?.authorization;
        if (auth?.startsWith('Bearer ')) return auth.split(' ')[1];
        return null;
    }
}
