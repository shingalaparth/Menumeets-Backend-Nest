import { Module } from '@nestjs/common';
import { KOTController } from './presentation/kot.controller';
import { KOTService } from './application/kot.service';
import { ShopModule } from '../shop/shop.module';
import { OrderModule } from '../order/order.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ShopModule,
        OrderModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('jwt.secret'),
                signOptions: { expiresIn: '12h' }, // Long session for KOT screen
            }),
        }),
    ],
    controllers: [KOTController],
    providers: [KOTService],
})
export class KOTModule { }
