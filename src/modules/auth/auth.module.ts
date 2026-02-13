import { Module } from '@nestjs/common';
import { AuthService } from './application/auth.service';
import { AuthController } from './presentation/auth.controller';
import { AUTH_REPOSITORY } from './domain/auth.repository';
import { AuthLocalRepository } from './infrastructure/auth.local.repository';
import { UserModule } from '../user/user.module';
import { VendorModule } from '../vendor/vendor.module';

@Module({
    imports: [UserModule, VendorModule],
    controllers: [AuthController],
    providers: [
        AuthService,
        {
            provide: AUTH_REPOSITORY,
            useClass: AuthLocalRepository,
        },
    ],
})
export class AuthModule { }
