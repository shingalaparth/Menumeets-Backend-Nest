import { Module } from '@nestjs/common';
import { CaptainController } from './presentation/captain.controller';
import { CaptainService } from './application/captain.service';
import { ShopModule } from '../shop/shop.module';
import { OrderModule } from '../order/order.module';
import { TableModule } from '../table/table.module';
import { InvoiceModule } from '../invoice/invoice.module';
import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ShopModule,
        OrderModule,
        TableModule,
        InvoiceModule,
        PrismaModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('jwt.secret'),
                signOptions: { expiresIn: '12h' },
            }),
        }),
    ],
    controllers: [CaptainController],
    providers: [CaptainService],
})
export class CaptainModule { }
