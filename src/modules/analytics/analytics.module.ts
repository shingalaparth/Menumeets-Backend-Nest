import { Module } from '@nestjs/common';
import { AnalyticsController } from './presentation/analytics.controller';
import { AnalyticsService } from './application/analytics.service';
import { AnalyticsPrismaRepository } from './infrastructure/analytics.prisma.repository';
import { ANALYTICS_REPOSITORY } from './domain/analytics.repository';
import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { AdminModule } from '../admin/admin.module';

@Module({
    imports: [PrismaModule, AdminModule],
    controllers: [AnalyticsController],
    providers: [
        AnalyticsService,
        {
            provide: ANALYTICS_REPOSITORY,
            useClass: AnalyticsPrismaRepository
        }
    ],
    exports: [AnalyticsService]
})
export class AnalyticsModule { }
