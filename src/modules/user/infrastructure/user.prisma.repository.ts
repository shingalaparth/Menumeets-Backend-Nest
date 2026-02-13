/**
 * User Prisma Repository — Infrastructure layer
 * Concrete implementation of UserRepository using PrismaService.
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { UserRepository } from '../domain/user.repository';
import { UserEntity, CreateUserData } from '../domain/user.entity';

@Injectable()
export class UserPrismaRepository implements UserRepository {
    constructor(private prisma: PrismaService) { }

    async findById(id: string): Promise<UserEntity | null> {
        return this.prisma.user.findUnique({ where: { id } });
    }

    async findByPhone(phone: string): Promise<UserEntity | null> {
        return this.prisma.user.findUnique({ where: { phone } });
    }

    async create(data: CreateUserData): Promise<UserEntity> {
        return this.prisma.user.create({ data });
    }
}
