import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { ShopRequestRepository } from '../domain/shop-request.repository';

@Injectable()
export class ShopRequestPrismaRepository implements ShopRequestRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: any): Promise<any> {
        return this.prisma.shopRequest.create({ data });
    }

    async findByShopId(shopId: string): Promise<any[]> {
        return this.prisma.shopRequest.findMany({
            where: { shopId },
            include: { foodCourt: true, franchise: true } // Include targets
        });
    }

    async findByFoodCourtId(foodCourtId: string): Promise<any[]> {
        return this.prisma.shopRequest.findMany({
            where: { foodCourtId },
            include: { shop: true } // Include requesting shop
        });
    }

    async findByFranchiseId(franchiseId: string): Promise<any[]> {
        return this.prisma.shopRequest.findMany({
            where: { franchiseId },
            include: { shop: true }
        });
    }

    async findById(id: string): Promise<any | null> {
        return this.prisma.shopRequest.findUnique({
            where: { id }
        });
    }

    async update(id: string, data: any): Promise<any> {
        return this.prisma.shopRequest.update({
            where: { id },
            data
        });
    }
}
