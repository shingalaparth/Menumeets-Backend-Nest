/**
 * User Repository Interface — Domain layer
 * Abstract contract that the application layer depends on.
 * The infrastructure layer provides the concrete implementation.
 */
import { UserEntity, CreateUserData } from './user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepository {
    findById(id: string): Promise<UserEntity | null>;
    findByPhone(phone: string): Promise<UserEntity | null>;
    create(data: CreateUserData): Promise<UserEntity>;
}
