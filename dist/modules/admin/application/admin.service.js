"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const admin_repository_1 = require("../domain/admin.repository");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../../../infrastructure/database/prisma.service");
const audit_service_1 = require("../../../shared/services/audit.service");
let AdminService = class AdminService {
    constructor(repo, jwtService, prisma, auditService) {
        this.repo = repo;
        this.jwtService = jwtService;
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async getDashboardStats() {
        return this.repo.getGlobalStats();
    }
    async getAllShops() {
        const shops = await this.repo.getAllShops(0, 100);
        return { count: shops.length, data: shops };
    }
    async getShopById(shopId) {
        const shop = await this.repo.findShopById(shopId);
        if (!shop)
            throw new common_1.NotFoundException('Shop not found');
        return shop;
    }
    async updateShopStatus(shopId) {
        const shop = await this.repo.findShopById(shopId);
        if (!shop)
            throw new common_1.NotFoundException('Shop not found');
        return this.repo.updateShop(shopId, { isActive: !shop.isActive });
    }
    async updateShopCommission(shopId, commission) {
        const shop = await this.repo.findShopById(shopId);
        if (!shop)
            throw new common_1.NotFoundException('Shop not found');
        const settings = shop.settings || {};
        const profile = settings.profile || {};
        profile.platformCommission = commission;
        settings.profile = profile;
        return this.repo.updateShop(shopId, { settings });
    }
    async deleteShop(shopId) {
        const shop = await this.repo.findShopById(shopId);
        if (!shop)
            throw new common_1.NotFoundException('Shop not found');
        await this.repo.deleteShop(shopId);
        return { message: 'Shop deleted successfully' };
    }
    async getAllVendors() {
        const vendors = await this.repo.getAllVendors(0, 100);
        return { count: vendors.length, data: vendors };
    }
    async getVendorById(vendorId) {
        const vendor = await this.repo.findVendorById(vendorId);
        if (!vendor)
            throw new common_1.NotFoundException('Vendor not found');
        return vendor;
    }
    async updateVendorStatus(vendorId) {
        const vendor = await this.repo.findVendorById(vendorId);
        if (!vendor)
            throw new common_1.NotFoundException('Vendor not found');
        return this.repo.updateVendor(vendorId, { isActive: !vendor.isActive });
    }
    async deleteVendor(vendorId) {
        const vendor = await this.repo.findVendorById(vendorId);
        if (!vendor)
            throw new common_1.NotFoundException('Vendor not found');
        await this.repo.deleteVendor(vendorId);
        return { message: 'Vendor deleted successfully' };
    }
    async impersonateVendor(vendorId) {
        const vendor = await this.repo.findVendorById(vendorId);
        if (!vendor)
            throw new common_1.NotFoundException('Vendor not found');
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
    async resetVendorPassword(vendorId, newPass) {
        const vendor = await this.repo.findVendorById(vendorId);
        if (!vendor)
            throw new common_1.NotFoundException('Vendor not found');
        const hashedPassword = await bcrypt.hash(newPass, 10);
        await this.repo.updateVendor(vendorId, { password: hashedPassword });
        return { message: 'Password reset successfully' };
    }
    async getAllOrders(page = 1, limit = 20, filters) {
        const skip = (page - 1) * limit;
        return this.repo.getAllOrders(skip, limit, filters);
    }
    async getOrderById(orderId) {
        const order = await this.repo.findOrderById(orderId);
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async updateOrderStatus(orderId, status) {
        const order = await this.repo.findOrderById(orderId);
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return this.repo.updateOrderStatus(orderId, status);
    }
    async getAllUsers(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        return this.repo.getAllUsers(skip, limit);
    }
    async getUserById(userId) {
        const user = await this.repo.findUserById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async getRevenueReport(startDate, endDate) {
        const start = startDate ? new Date(startDate) : new Date(new Date().setMonth(new Date().getMonth() - 1));
        const end = endDate ? new Date(endDate) : new Date();
        return this.repo.getRevenueReport(start, end);
    }
    async getTopSellingItems(limit = 10, startDate, endDate) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.repo.getTopSellingItems(limit, start, end);
    }
    async getSystemConfig() {
        return this.repo.getSystemConfigs();
    }
    async updateSystemConfig(key, value, description) {
        return this.repo.upsertSystemConfig(key, value, description);
    }
    async sendBroadcast(title, message, recipientId) {
        return this.repo.createBroadcast({
            title,
            message,
            recipientId: recipientId || null
        });
    }
    async getBroadcasts() {
        return this.repo.getBroadcasts();
    }
    async getSettlements(page = 1, limit = 20, filters) {
        const skip = (page - 1) * limit;
        const where = {};
        if (filters?.shopId)
            where.shopId = filters.shopId;
        if (filters?.status)
            where.status = filters.status;
        if (filters?.period)
            where.period = filters.period;
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
    async processSettlement(adminId, settlementId, reference) {
        const settlement = await this.prisma.settlement.findUnique({
            where: { id: settlementId }
        });
        if (!settlement)
            throw new common_1.NotFoundException('Settlement not found');
        if (settlement.status === 'PROCESSED')
            throw new common_1.BadRequestException('Already processed');
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
    async createSettlement(data) {
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
    async getAuditLogs(filters) {
        return this.auditService.getLogs(filters);
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(admin_repository_1.ADMIN_REPOSITORY)),
    __metadata("design:paramtypes", [Object, jwt_1.JwtService,
        prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], AdminService);
//# sourceMappingURL=admin.service.js.map