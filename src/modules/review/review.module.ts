import { Module } from '@nestjs/common';
import { ReviewController } from './presentation/review.controller';
import { ReviewService } from './application/review.service';
import { ReviewPrismaRepository } from './infrastructure/review.prisma.repository';
import { REVIEW_REPOSITORY } from './domain/review.repository';

@Module({
    controllers: [ReviewController],
    providers: [
        ReviewService,
        {
            provide: REVIEW_REPOSITORY,
            useClass: ReviewPrismaRepository,
        },
    ],
    exports: [ReviewService],
})
export class ReviewModule { }
