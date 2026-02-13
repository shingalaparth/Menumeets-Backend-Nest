import { Module } from '@nestjs/common';
import { UserService } from './application/user.service';
import { UserController } from './presentation/user.controller';
import { USER_REPOSITORY } from './domain/user.repository';
import { UserPrismaRepository } from './infrastructure/user.prisma.repository';

@Module({
    controllers: [UserController],
    providers: [
        UserService,
        {
            provide: USER_REPOSITORY,
            useClass: UserPrismaRepository,
        },
    ],
    exports: [UserService], // Auth module needs UserService
})
export class UserModule { }
