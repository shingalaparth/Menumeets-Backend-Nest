import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { UserRepository } from '../domain/user.repository';
import { UserEntity, CreateUserData } from '../domain/user.entity';
export declare class UserPrismaRepository implements UserRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<UserEntity | null>;
    findByPhone(phone: string): Promise<UserEntity | null>;
    create(data: CreateUserData): Promise<UserEntity>;
}
