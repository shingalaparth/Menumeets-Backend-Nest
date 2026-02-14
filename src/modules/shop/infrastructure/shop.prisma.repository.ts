/**
 * Shop Prisma Repository — Infrastructure layer
 * Concrete implementation of ShopRepository using PrismaService.
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { ShopRepository } from '../domain/shop.repository';
import { ShopEntity, CreateShopData } from '../domain/shop.entity';

@Injectable()
export class ShopPrismaRepository implements ShopRepository {
    constructor(private prisma: PrismaService) { }

    async findById(id: string): Promise<ShopEntity | null> {
        return this.prisma.shop.findUnique({ where: { id } }) as unknown as ShopEntity | null;
    }

    async findByOwnerId(ownerId: string): Promise<ShopEntity[]> {
        return this.prisma.shop.findMany({ where: { ownerId } }) as unknown as ShopEntity[];
    }

    async findByIds(ids: string[]): Promise<ShopEntity[]> {
        return this.prisma.shop.findMany({
            where: { id: { in: ids } },
        }) as unknown as ShopEntity[];
    }

    async create(data: CreateShopData): Promise<ShopEntity> {
        return this.prisma.shop.create({ data }) as unknown as ShopEntity;
    }

    async update(id: string, data: Partial<ShopEntity>): Promise<ShopEntity> {
        return this.prisma.shop.update({
            where: { id },
            data: data as any,
        }) as unknown as ShopEntity;
    }

    async delete(id: string): Promise<void> {
        await this.prisma.shop.delete({ where: { id } });
    }
}
