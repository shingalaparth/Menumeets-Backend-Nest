/**
 * @Roles() decorator — used with RolesGuard
 * Replaces old authorize(...roles) middleware pattern.
 *
 * Usage: @Roles('admin', 'vendor')
 */
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
