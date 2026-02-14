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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("../application/admin.service");
const universal_auth_guard_1 = require("../../../shared/guards/universal-auth.guard");
const roles_guard_1 = require("../../../shared/guards/roles.guard");
const roles_decorator_1 = require("../../../shared/decorators/roles.decorator");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getStats() {
        return this.adminService.getDashboardStats();
    }
    async getShops() {
        return this.adminService.getAllShops();
    }
    async getShopById(id) {
        return this.adminService.getShopById(id);
    }
    async toggleShopStatus(id) {
        return this.adminService.updateShopStatus(id);
    }
    async updateCommission(id, commission) {
        return this.adminService.updateShopCommission(id, commission);
    }
    async deleteShop(id) {
        return this.adminService.deleteShop(id);
    }
    async getVendors() {
        return this.adminService.getAllVendors();
    }
    async getVendorById(id) {
        return this.adminService.getVendorById(id);
    }
    async updateVendorStatus(id) {
        return this.adminService.updateVendorStatus(id);
    }
    async deleteVendor(id) {
        return this.adminService.deleteVendor(id);
    }
    async impersonate(id) {
        return this.adminService.impersonateVendor(id);
    }
    async resetPassword(id, password) {
        return this.adminService.resetVendorPassword(id, password);
    }
    async getAllOrders(page, limit, status, shopId, startDate, endDate) {
        const filters = {};
        if (status)
            filters.status = status;
        if (shopId)
            filters.shopId = shopId;
        if (startDate)
            filters.startDate = startDate;
        if (endDate)
            filters.endDate = endDate;
        return this.adminService.getAllOrders(parseInt(page || '1'), parseInt(limit || '20'), filters);
    }
    async getOrderById(id) {
        return this.adminService.getOrderById(id);
    }
    async updateOrderStatus(id, status) {
        return this.adminService.updateOrderStatus(id, status);
    }
    async getAllUsers(page, limit) {
        return this.adminService.getAllUsers(parseInt(page || '1'), parseInt(limit || '20'));
    }
    async getUserById(id) {
        return this.adminService.getUserById(id);
    }
    async getRevenueReport(startDate, endDate) {
        return this.adminService.getRevenueReport(startDate || '', endDate || '');
    }
    async getTopSellingItems(limit, startDate, endDate) {
        return this.adminService.getTopSellingItems(parseInt(limit || '10'), startDate, endDate);
    }
    async getSystemConfig() {
        return this.adminService.getSystemConfig();
    }
    async updateSystemConfig(key, value, description) {
        return this.adminService.updateSystemConfig(key, value, description);
    }
    async sendBroadcast(title, message, recipientId) {
        return this.adminService.sendBroadcast(title, message, recipientId);
    }
    async getBroadcasts() {
        return this.adminService.getBroadcasts();
    }
    async getSettlements(page, limit, shopId, status, period) {
        return this.adminService.getSettlements(parseInt(page || '1'), parseInt(limit || '20'), { shopId, status, period });
    }
    async createSettlement(body) {
        return this.adminService.createSettlement(body);
    }
    async processSettlement(req, id, reference) {
        const adminId = req.user?.sub || req.user?.id || 'system';
        return this.adminService.processSettlement(adminId, id, reference);
    }
    async getAuditLogs(actorId, entityType, entityId, action, startDate, endDate, page, limit) {
        return this.adminService.getAuditLogs({
            actorId, entityType, entityId, action,
            startDate, endDate,
            page: parseInt(page || '1'),
            limit: parseInt(limit || '50')
        });
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('analytics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('shops'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getShops", null);
__decorate([
    (0, common_1.Get)('shops/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getShopById", null);
__decorate([
    (0, common_1.Patch)('shops/:id/toggle'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "toggleShopStatus", null);
__decorate([
    (0, common_1.Patch)('shops/:id/commission'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('commission')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateCommission", null);
__decorate([
    (0, common_1.Delete)('shops/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteShop", null);
__decorate([
    (0, common_1.Get)('vendors'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getVendors", null);
__decorate([
    (0, common_1.Get)('vendors/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getVendorById", null);
__decorate([
    (0, common_1.Patch)('vendors/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateVendorStatus", null);
__decorate([
    (0, common_1.Delete)('vendors/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteVendor", null);
__decorate([
    (0, common_1.Post)('impersonate/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "impersonate", null);
__decorate([
    (0, common_1.Patch)('vendors/:id/reset-password'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Get)('orders'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('shopId')),
    __param(4, (0, common_1.Query)('startDate')),
    __param(5, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllOrders", null);
__decorate([
    (0, common_1.Get)('orders/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getOrderById", null);
__decorate([
    (0, common_1.Patch)('orders/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateOrderStatus", null);
__decorate([
    (0, common_1.Get)('users'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('users/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Get)('reports/revenue'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getRevenueReport", null);
__decorate([
    (0, common_1.Get)('reports/top-items'),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getTopSellingItems", null);
__decorate([
    (0, common_1.Get)('config'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getSystemConfig", null);
__decorate([
    (0, common_1.Patch)('config'),
    __param(0, (0, common_1.Body)('key')),
    __param(1, (0, common_1.Body)('value')),
    __param(2, (0, common_1.Body)('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateSystemConfig", null);
__decorate([
    (0, common_1.Post)('messages'),
    __param(0, (0, common_1.Body)('title')),
    __param(1, (0, common_1.Body)('message')),
    __param(2, (0, common_1.Body)('recipientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "sendBroadcast", null);
__decorate([
    (0, common_1.Get)('messages/sent'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getBroadcasts", null);
__decorate([
    (0, common_1.Get)('settlements'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('shopId')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getSettlements", null);
__decorate([
    (0, common_1.Post)('settlements'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createSettlement", null);
__decorate([
    (0, common_1.Post)('settlements/:id/process'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('reference')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "processSettlement", null);
__decorate([
    (0, common_1.Get)('audit-logs'),
    __param(0, (0, common_1.Query)('actorId')),
    __param(1, (0, common_1.Query)('entityType')),
    __param(2, (0, common_1.Query)('entityId')),
    __param(3, (0, common_1.Query)('action')),
    __param(4, (0, common_1.Query)('startDate')),
    __param(5, (0, common_1.Query)('endDate')),
    __param(6, (0, common_1.Query)('page')),
    __param(7, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAuditLogs", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(universal_auth_guard_1.UniversalAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map