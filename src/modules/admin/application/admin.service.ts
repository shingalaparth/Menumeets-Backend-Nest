import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { AdminRepository, ADMIN_REPOSITORY } from '../domain/admin.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { AuditService } from '../../../shared/services/audit.service';

@Injectable()
export class AdminService {
    constructor(
        @Inject(ADMIN_REPOSITORY) private readonly repo: AdminRepository,
        private jwtService: JwtService,
        private prisma: PrismaService,
        private auditService: AuditService
    ) { }

    // ──────────────────────────────────────
    // Dashboard
    // ──────────────────────────────────────
    async getDashboardStats() {
        return this.repo.getGlobalStats();
    }

    // ──────────────────────────────────────
    // Shops
    // ──────────────────────────────────────
    async getAllShops() {
        const shops = await this.repo.getAllShops(0, 100);
        return { count: shops.length, data: shops };
    }

    async getShopById(shopId: string) {
        const shop = await this.repo.findShopById(shopId);
        if (!shop) throw new NotFoundException('Shop not found');
        return shop;
    }

    async updateShopStatus(shopId: string) {
        const shop = await this.repo.findShopById(shopId);
        if (!shop) throw new NotFoundException('Shop not found');
        return this.repo.updateShop(shopId, { isActive: !shop.isActive });
    }

    async updateShopCommission(shopId: string, commission: number) {
        const shop = await this.repo.findShopById(shopId);
        if (!shop) throw new NotFoundException('Shop not found');

        const settings = (shop.settings as any) || {};
        const profile = settings.profile || {};
        profile.platformCommission = commission;
        settings.profile = profile;

        return this.repo.updateShop(shopId, { settings });
    }

    async deleteShop(shopId: string) {
        const shop = await this.repo.findShopById(shopId);
        if (!shop) throw new NotFoundException('Shop not found');
        await this.repo.deleteShop(shopId);
        return { message: 'Shop deleted successfully' };
    }

    // ──────────────────────────────────────
    // Vendors
    // ──────────────────────────────────────
    async getAllVendors() {
        const vendors = await this.repo.getAllVendors(0, 100);
        return { count: vendors.length, data: vendors };
    }

    async getVendorById(vendorId: string) {
        const vendor = await this.repo.findVendorById(vendorId);
        if (!vendor) throw new NotFoundException('Vendor not found');
        return vendor;
    }

    async updateVendorStatus(vendorId: string) {
        const vendor = await this.repo.findVendorById(vendorId);
        if (!vendor) throw new NotFoundException('Vendor not found');
        return this.repo.updateVendor(vendorId, { isActive: !(vendor as any).isActive });
    }

    async deleteVendor(vendorId: string) {
        const vendor = await this.repo.findVendorById(vendorId);
        if (!vendor) throw new NotFoundException('Vendor not found');
        await this.repo.deleteVendor(vendorId);
        return { message: 'Vendor deleted successfully' };
    }

    async impersonateVendor(vendorId: string) {
        const vendor = await this.repo.findVendorById(vendorId);
        if (!vendor) throw new NotFoundException('Vendor not found');

        const payload = { sub: vendor.id, role: vendor.role };
        const token = this.jwtService.sign(payload);

        return {
            message: `Impersonating ${vendor.name}`,
            token,
            vendor: {
                id: vendor.id,
                name: vendor.name,
                role: vendor.role
            }
        };
    }

    async resetVendorPassword(vendorId: string, newPass: string) {
        const vendor = await this.repo.findVendorById(vendorId);
        if (!vendor) throw new NotFoundException('Vendor not found');

        const hashedPassword = await bcrypt.hash(newPass, 10);
        await this.repo.updateVendor(vendorId, { password: hashedPassword });

        return { message: 'Password reset successfully' };
    }

    // ──────────────────────────────────────
    // Orders
    // ──────────────────────────────────────
    async getAllOrders(page = 1, limit = 20, filters?: any) {
        const skip = (page - 1) * limit;
        return this.repo.getAllOrders(skip, limit, filters);
    }

    async getOrderById(orderId: string) {
        const order = await this.repo.findOrderById(orderId);
        if (!order) throw new NotFoundException('Order not found');
        return order;
    }

    async updateOrderStatus(orderId: string, status: string) {
        const order = await this.repo.findOrderById(orderId);
        if (!order) throw new NotFoundException('Order not found');
        return this.repo.updateOrderStatus(orderId, status);
    }

    // ──────────────────────────────────────
    // Users
    // ──────────────────────────────────────
    async getAllUsers(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        return this.repo.getAllUsers(skip, limit);
    }

    async getUserById(userId: string) {
        const user = await this.repo.findUserById(userId);
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    // ──────────────────────────────────────
    // Reports
    // ──────────────────────────────────────
    async getRevenueReport(startDate: string, endDate: string) {
        const start = startDate ? new Date(startDate) : new Date(new Date().setMonth(new Date().getMonth() - 1));
        const end = endDate ? new Date(endDate) : new Date();
        return this.repo.getRevenueReport(start, end);
    }

    async getTopSellingItems(limit = 10, startDate?: string, endDate?: string) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.repo.getTopSellingItems(limit, start, end);
    }

    // ──────────────────────────────────────
    // System Config
    // ──────────────────────────────────────
    async getSystemConfig() {
        return this.repo.getSystemConfigs();
    }

    async updateSystemConfig(key: string, value: any, description?: string) {
        return this.repo.upsertSystemConfig(key, value, description);
    }

    // ──────────────────────────────────────
    // Broadcasts
    // ──────────────────────────────────────
    async sendBroadcast(title: string, message: string, recipientId?: string) {
        return this.repo.createBroadcast({
            title,
            message,
            recipientId: recipientId || null
        });
    }

    async getBroadcasts() {
        return this.repo.getBroadcasts();
    }

    // ──────────────────────────────────────
    // Settlements (Governance)
    // ──────────────────────────────────────
    async getSettlements(page = 1, limit = 20, filters?: { shopId?: string; status?: string; period?: string }) {
        const skip = (page - 1) * limit;
        const where: any = {};
        if (filters?.shopId) where.shopId = filters.shopId;
        if (filters?.status) where.status = filters.status;
        if (filters?.period) where.period = filters.period;

        const [settlements, total] = await Promise.all([
            this.prisma.settlement.findMany({
                where,
                include: { shop: { select: { id: true, name: true } } },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            this.prisma.settlement.count({ where })
        ]);

        return {
            settlements,
            pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
        };
    }

    async processSettlement(adminId: string, settlementId: string, reference?: string) {
        const settlement = await this.prisma.settlement.findUnique({
            where: { id: settlementId }
        });
        if (!settlement) throw new NotFoundException('Settlement not found');
        if (settlement.status === 'PROCESSED') throw new BadRequestException('Already processed');

        const before = { ...settlement };

        const updated = await this.prisma.settlement.update({
            where: { id: settlementId },
            data: {
                status: 'PROCESSED',
                processedAt: new Date(),
                processedBy: adminId,
                reference: reference || null
            }
        });

        // Audit trail
        await this.auditService.log({
            actorId: adminId,
            actorType: 'admin',
            action: 'SETTLEMENT_PROCESS',
            entityType: 'Settlement',
            entityId: settlementId,
            before,
            after: updated
        });

        return updated;
    }

    async createSettlement(data: {
        shopId: string;
        amount: number;
        commission: number;
        netPayout: number;
        period: string;
    }) {
        return this.prisma.settlement.create({
            data: {
                shopId: data.shopId,
                amount: data.amount,
                commission: data.commission,
                netPayout: data.netPayout,
                period: data.period,
                status: 'PENDING'
            }
        });
    }

    // ──────────────────────────────────────
    // Audit Logs
    // ──────────────────────────────────────
    async getAuditLogs(filters: any) {
        return this.auditService.getLogs(filters);
    }
}
