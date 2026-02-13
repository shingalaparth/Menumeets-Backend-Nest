/**
 * User Controller — migrated from old user.controller.js + user.routes.js
 *
 * Old: GET /api/users/profile (protectUser)
 * New: GET /users/profile (UserAuthGuard)
 */
import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from '../application/user.service';
import { UserAuthGuard } from '../../../shared/guards/user-auth.guard';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @Get('profile')
    @UseGuards(UserAuthGuard)
    async getProfile(@CurrentUser() user: any) {
        return this.userService.getProfile(user.id);
    }
}
