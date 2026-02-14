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
exports.FoodCourtController = void 0;
const common_1 = require("@nestjs/common");
const food_court_service_1 = require("../application/food-court.service");
const vendor_auth_guard_1 = require("../../../shared/guards/vendor-auth.guard");
const roles_guard_1 = require("../../../shared/guards/roles.guard");
const roles_decorator_1 = require("../../../shared/decorators/roles.decorator");
const current_user_decorator_1 = require("../../../shared/decorators/current-user.decorator");
let FoodCourtController = class FoodCourtController {
    constructor(service) {
        this.service = service;
    }
    async createFoodCourt(req, body) {
        return this.service.createFoodCourt(req.vendor.sub || req.vendor.id, body);
    }
    async getAllFoodCourts() {
        return this.service.getAllFoodCourts();
    }
    async getFoodCourt(id) {
        return this.service.getFoodCourt(id);
    }
    async updateFoodCourt(id, body) {
        return this.service.updateFoodCourt(id, body);
    }
    async getShops(id) {
        return this.service.getShops(id);
    }
    async addShop(id, body) {
        return this.service.addShop(id, body.shopId);
    }
    async removeShop(id, shopId) {
        return this.service.removeShop(id, shopId);
    }
    async requestToJoin(foodCourtId, shopId, vendor) {
        return this.service.requestToJoin(shopId, foodCourtId);
    }
    async getJoinRequests(foodCourtId, vendor) {
        return this.service.getJoinRequests(foodCourtId);
    }
    async resolveJoinRequest(foodCourtId, requestId, body, vendor) {
        return this.service.resolveJoinRequest(foodCourtId, requestId, body.accept);
    }
    async getAnalytics(foodCourtId, duration = 'week', vendor) {
        return this.service.getAnalytics(foodCourtId, duration);
    }
};
exports.FoodCourtController = FoodCourtController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FoodCourtController.prototype, "createFoodCourt", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'manager', 'vendor'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FoodCourtController.prototype, "getAllFoodCourts", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'manager', 'vendor'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FoodCourtController.prototype, "getFoodCourt", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FoodCourtController.prototype, "updateFoodCourt", null);
__decorate([
    (0, common_1.Get)(':id/shops'),
    (0, roles_decorator_1.Roles)('admin', 'manager', 'vendor'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FoodCourtController.prototype, "getShops", null);
__decorate([
    (0, common_1.Post)(':id/shops'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FoodCourtController.prototype, "addShop", null);
__decorate([
    (0, common_1.Delete)(':id/shops/:shopId'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('shopId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FoodCourtController.prototype, "removeShop", null);
__decorate([
    (0, common_1.Post)(':foodCourtId/join-requests/:shopId'),
    (0, roles_decorator_1.Roles)('vendor', 'admin', 'food_court_manager'),
    __param(0, (0, common_1.Param)('foodCourtId')),
    __param(1, (0, common_1.Param)('shopId')),
    __param(2, (0, current_user_decorator_1.CurrentVendor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], FoodCourtController.prototype, "requestToJoin", null);
__decorate([
    (0, common_1.Get)(':foodCourtId/join-requests'),
    (0, roles_decorator_1.Roles)('vendor', 'admin', 'food_court_manager'),
    __param(0, (0, common_1.Param)('foodCourtId')),
    __param(1, (0, current_user_decorator_1.CurrentVendor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FoodCourtController.prototype, "getJoinRequests", null);
__decorate([
    (0, common_1.Put)(':foodCourtId/join-requests/:requestId'),
    (0, roles_decorator_1.Roles)('vendor', 'admin', 'food_court_manager'),
    __param(0, (0, common_1.Param)('foodCourtId')),
    __param(1, (0, common_1.Param)('requestId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentVendor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], FoodCourtController.prototype, "resolveJoinRequest", null);
__decorate([
    (0, common_1.Get)(':foodCourtId/analytics'),
    (0, roles_decorator_1.Roles)('vendor', 'admin', 'food_court_manager'),
    __param(0, (0, common_1.Param)('foodCourtId')),
    __param(1, (0, common_1.Query)('duration')),
    __param(2, (0, current_user_decorator_1.CurrentVendor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], FoodCourtController.prototype, "getAnalytics", null);
exports.FoodCourtController = FoodCourtController = __decorate([
    (0, common_1.Controller)('food-courts'),
    (0, common_1.UseGuards)(vendor_auth_guard_1.VendorAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [food_court_service_1.FoodCourtService])
], FoodCourtController);
//# sourceMappingURL=food-court.controller.js.map