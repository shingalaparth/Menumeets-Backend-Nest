/**
 * Prisma Service — replaces old config/database.js (MongoDB → PostgreSQL)
 *
 * Old: mongoose.connect() with pool settings
 * New: Prisma Client with lifecycle hooks
 */
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        super({
            log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
        });
    }

    async onModuleInit() {
        await this.$connect();
        console.log('✅ PostgreSQL Connected (Prisma)');
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
