import { UserRepository } from '../domain/user.repository';
import { CreateUserData } from '../domain/user.entity';
export declare class UserService {
    private userRepo;
    constructor(userRepo: UserRepository);
    getProfile(userId: string): Promise<{
        id: string;
        name: string;
        phone: string;
    }>;
    findByPhone(phone: string): Promise<import("../domain/user.entity").UserEntity | null>;
    create(data: CreateUserData): Promise<import("../domain/user.entity").UserEntity>;
}
