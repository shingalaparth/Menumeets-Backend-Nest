/**
 * Universal Auth Guard — migrated from old authUniversal.middleware.js
 * Tries to authenticate as User first, then Vendor. Sets req.user or req.vendor.
 */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { verifyJWT } from '../utils/jwt.util';

@Injectable()
export class UniversalAuthGuard implements CanActivate {
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

            // Try User first
            if (decoded.sub || decoded.id) {
                const user = await this.prisma.user.findUnique({
                    where: { id: (decoded.sub || decoded.id) as string },
                });

                if (user) {
                    request.user = user;
                    return true;
                }
            }

            // Then try Vendor
            // Prisma expects specific type for where, let's use explicit ID if available
            if (decoded.sub || decoded.id) {
                const vendor = await this.prisma.vendor.findUnique({
                    where: { id: (decoded.sub || decoded.id) as string }
                });

                if (vendor) {
                    request.vendor = vendor;
                    return true;
                }
            }

            // Fallback: attach decoded token if no db match found (or throw error?)
            // For now, fail if not found in DB to ensure valid identity
            throw new UnauthorizedException('User or Vendor not found');
        } catch {
            throw new UnauthorizedException('Not authorized, invalid token');
        }
    }

    private extractToken(request: any): string | null {
        if (request.cookies?.token) return request.cookies.token;
        if (request.cookies?.customerToken) return request.cookies.customerToken;
        const auth = request.headers?.authorization;
        if (auth?.startsWith('Bearer ')) return auth.split(' ')[1];
        return null;
    }
}
