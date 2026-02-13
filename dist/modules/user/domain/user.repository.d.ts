import { UserEntity, CreateUserData } from './user.entity';
export declare const USER_REPOSITORY: unique symbol;
export interface UserRepository {
    findById(id: string): Promise<UserEntity | null>;
    findByPhone(phone: string): Promise<UserEntity | null>;
    create(data: CreateUserData): Promise<UserEntity>;
}
