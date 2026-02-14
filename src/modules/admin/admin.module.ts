import { Module } from '@nestjs/common';
import { AdminController } from './presentation/admin.controller';
import { AdminService } from './application/admin.service';
import { AdminPrismaRepository } from './infrastructure/admin.prisma.repository';
import { ADMIN_REPOSITORY } from './domain/admin.repository';
import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        PrismaModule,
        JwtModule.registerAsync({
            useFactory: (config: ConfigService) => ({
                secret: config.get('JWT_SECRET'),
                signOptions: { expiresIn: '1d' },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AdminController],
    providers: [
        AdminService,
        {
            provide: ADMIN_REPOSITORY,
            useClass: AdminPrismaRepository
        }
    ],
    exports: [AdminService]
})
export class AdminModule { }
