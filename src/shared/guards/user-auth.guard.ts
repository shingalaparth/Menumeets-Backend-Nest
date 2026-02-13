/**
 * User JWT Auth Guard — migrated from old userAuth.middleware.js + auth_user.middleware.js
 *
 * Old: Reads token from customerToken/token cookie or Bearer header, finds User in DB
 * New: NestJS guard with same logic
 */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { verifyJWT } from '../utils/jwt.util';

@Injectable()
export class UserAuthGuard implements CanActivate {
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

            // Find user in DB
            const user = await this.prisma.user.findUnique({
                where: { id: decoded.id },
            });

            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            request.user = user;
            return true;
        } catch (error) {
            if (error instanceof UnauthorizedException) throw error;
            throw new UnauthorizedException('Not authorized, invalid token');
        }
    }

    private extractToken(request: any): string | null {
        // 1. customerToken cookie (old pattern)
        if (request.cookies?.customerToken) return request.cookies.customerToken;
        // 2. token cookie
        if (request.cookies?.token) return request.cookies.token;
        // 3. Bearer header
        const auth = request.headers?.authorization;
        if (auth?.startsWith('Bearer ')) return auth.split(' ')[1];
        return null;
    }
}
