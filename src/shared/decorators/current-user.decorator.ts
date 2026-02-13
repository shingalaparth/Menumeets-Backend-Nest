/**
 * @CurrentUser() / @CurrentVendor() decorators
 * Replaces old req.user / req.vendor access pattern.
 *
 * Usage:
 *   @CurrentUser() user: User
 *   @CurrentVendor() vendor: any
 */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);

export const CurrentVendor = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.vendor;
    },
);
