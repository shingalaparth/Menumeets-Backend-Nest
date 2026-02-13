import { UserService } from '../application/user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getProfile(user: any): Promise<{
        id: string;
        name: string;
        phone: string;
    }>;
}
