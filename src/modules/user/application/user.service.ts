/**
 * User Service — Application layer
 * Depends on UserRepository interface (injected), NOT on PrismaService directly.
 */
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY, UserRepository } from '../domain/user.repository';
import { CreateUserData } from '../domain/user.entity';

@Injectable()
export class UserService {
    constructor(
        @Inject(USER_REPOSITORY) private userRepo: UserRepository,
    ) { }

    /** Get user profile by ID */
    async getProfile(userId: string) {
        const user = await this.userRepo.findById(userId);
        if (!user) throw new NotFoundException('User not found');

        return {
            id: user.id,
            name: user.name,
            phone: user.phone,
        };
    }

    /** Find user by phone (used by auth) */
    async findByPhone(phone: string) {
        return this.userRepo.findByPhone(phone);
    }

    /** Create new user (used by auth) */
    async create(data: CreateUserData) {
        return this.userRepo.create(data);
    }
}
