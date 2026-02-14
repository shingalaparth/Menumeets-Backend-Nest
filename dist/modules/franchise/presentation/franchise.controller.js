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
exports.FranchiseController = void 0;
const common_1 = require("@nestjs/common");
const franchise_service_1 = require("../application/franchise.service");
const vendor_auth_guard_1 = require("../../../shared/guards/vendor-auth.guard");
const roles_guard_1 = require("../../../shared/guards/roles.guard");
const roles_decorator_1 = require("../../../shared/decorators/roles.decorator");
const current_user_decorator_1 = require("../../../shared/decorators/current-user.decorator");
let FranchiseController = class FranchiseController {
    constructor(franchiseService) {
        this.franchiseService = franchiseService;
    }
    async createFranchise(req, body) {
        return this.franchiseService.createFranchise(req.vendor.sub || req.vendor.id, body);
    }
    async getMyFranchise(req) {
        return this.franchiseService.getMyFranchise(req.vendor.sub || req.vendor.id);
    }
    async updateFranchise(req, body) {
        return this.franchiseService.updateFranchise(req.vendor.sub || req.vendor.id, body);
    }
    async getOutlets(req) {
        return this.franchiseService.getOutlets(req.vendor.sub || req.vendor.id);
    }
    async addManager(franchiseId, vendor, body) {
        return this.franchiseService.addManager(vendor.id, body.vendorId, body);
    }
    async removeManager(franchiseId, managerVendorId, vendor) {
        return this.franchiseService.removeManager(vendor.id, managerVendorId);
    }
    async getManagers(franchiseId, vendor) {
        return this.franchiseService.getManagers(vendor.id);
    }
    async getAnalytics(franchiseId, duration = 'week', vendor) {
        return this.franchiseService.getFranchiseAnalytics(vendor.id, duration);
    }
    async addOutlet(req, shopId) {
        return this.franchiseService.addOutlet(req.vendor.sub || req.vendor.id, shopId);
    }
    async removeOutlet(req, shopId) {
        return this.franchiseService.removeOutlet(req.vendor.sub || req.vendor.id, shopId);
    }
};
exports.FranchiseController = FranchiseController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('vendor', 'admin', 'franchise_owner'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FranchiseController.prototype, "createFranchise", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('vendor', 'admin', 'franchise_owner'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FranchiseController.prototype, "getMyFranchise", null);
__decorate([
    (0, common_1.Put)(),
    (0, roles_decorator_1.Roles)('vendor', 'admin', 'franchise_owner'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FranchiseController.prototype, "updateFranchise", null);
__decorate([
    (0, common_1.Get)('outlets'),
    (0, roles_decorator_1.Roles)('vendor', 'admin', 'franchise_owner'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FranchiseController.prototype, "getOutlets", null);
__decorate([
    (0, common_1.Post)(':franchiseId/managers'),
    (0, roles_decorator_1.Roles)('vendor', 'admin', 'franchise_owner'),
    __param(0, (0, common_1.Param)('franchiseId')),
    __param(1, (0, current_user_decorator_1.CurrentVendor)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], FranchiseController.prototype, "addManager", null);
__decorate([
    (0, common_1.Delete)(':franchiseId/managers/:managerVendorId'),
    (0, roles_decorator_1.Roles)('vendor', 'admin', 'franchise_owner'),
    __param(0, (0, common_1.Param)('franchiseId')),
    __param(1, (0, common_1.Param)('managerVendorId')),
    __param(2, (0, current_user_decorator_1.CurrentVendor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], FranchiseController.prototype, "removeManager", null);
__decorate([
    (0, common_1.Get)(':franchiseId/managers'),
    (0, roles_decorator_1.Roles)('vendor', 'admin', 'franchise_owner'),
    __param(0, (0, common_1.Param)('franchiseId')),
    __param(1, (0, current_user_decorator_1.CurrentVendor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FranchiseController.prototype, "getManagers", null);
__decorate([
    (0, common_1.Get)(':franchiseId/analytics'),
    (0, roles_decorator_1.Roles)('vendor', 'admin', 'franchise_owner'),
    __param(0, (0, common_1.Param)('franchiseId')),
    __param(1, (0, common_1.Query)('duration')),
    __param(2, (0, current_user_decorator_1.CurrentVendor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], FranchiseController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Post)('outlets/:shopId'),
    (0, roles_decorator_1.Roles)('vendor', 'admin', 'franchise_owner'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('shopId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FranchiseController.prototype, "addOutlet", null);
__decorate([
    (0, common_1.Delete)('outlets/:shopId'),
    (0, roles_decorator_1.Roles)('vendor', 'admin', 'franchise_owner'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('shopId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FranchiseController.prototype, "removeOutlet", null);
exports.FranchiseController = FranchiseController = __decorate([
    (0, common_1.Controller)('franchise'),
    (0, common_1.UseGuards)(vendor_auth_guard_1.VendorAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [franchise_service_1.FranchiseService])
], FranchiseController);
//# sourceMappingURL=franchise.controller.js.map