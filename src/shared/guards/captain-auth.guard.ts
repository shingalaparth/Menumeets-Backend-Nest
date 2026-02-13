/**
 * Captain Auth Guard — migrated from old auth.middleware.js → protectCaptain()
 * Verifies JWT and checks role === 'captain'
 */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verifyJWT } from '../utils/jwt.util';

@Injectable()
export class CaptainAuthGuard implements CanActivate {
    constructor(private configService: ConfigService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const auth = request.headers?.authorization;

        if (!auth?.startsWith('Bearer ')) {
            throw new UnauthorizedException('Not authorized within Captain App');
        }

        const token = auth.split(' ')[1];

        try {
            const secret = this.configService.get<string>('jwt.secret', '');
            const decoded = verifyJWT(token, secret);

            if (decoded.role !== 'captain') {
                throw new ForbiddenException('Access denied. Captain role required.');
            }

            request.user = decoded; // { id: shopId, role: 'captain', name: shopName }
            return true;
        } catch (error) {
            if (error instanceof ForbiddenException) throw error;
            throw new UnauthorizedException('Session expired or invalid');
        }
    }
}
