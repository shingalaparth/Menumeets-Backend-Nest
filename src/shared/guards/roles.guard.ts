/**
 * Roles Guard — migrated from old authorize.middleware.js
 * Works with @Roles() decorator to check vendor roles.
 *
 * Old: authorize(...roles) → checks req.vendor.role
 * New: RolesGuard reads @Roles() metadata
 */
import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles || requiredRoles.length === 0) {
            return true; // No roles required, allow access
        }

        const request = context.switchToHttp().getRequest();
        const vendor = request.vendor;

        if (!vendor || !vendor.role) {
            throw new ForbiddenException('Access denied. No role found.');
        }

        if (!requiredRoles.includes(vendor.role)) {
            throw new ForbiddenException('Access denied. You do not have permission for this action.');
        }

        return true;
    }
}
