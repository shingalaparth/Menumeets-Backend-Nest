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
exports.SystemController = void 0;
const common_1 = require("@nestjs/common");
const system_service_1 = require("../application/system.service");
const universal_auth_guard_1 = require("../../../shared/guards/universal-auth.guard");
const roles_guard_1 = require("../../../shared/guards/roles.guard");
const roles_decorator_1 = require("../../../shared/decorators/roles.decorator");
const current_user_decorator_1 = require("../../../shared/decorators/current-user.decorator");
let SystemController = class SystemController {
    constructor(service) {
        this.service = service;
    }
    async getPaymentConfig() {
        return this.service.getPaymentConfig();
    }
    async updatePaymentConfig(user, body) {
        return this.service.updatePaymentConfig(user.userId || user.vendorId, body);
    }
    async getPublicPaymentConfig() {
        return {
            success: true,
            data: await this.service.getPublicPaymentConfig()
        };
    }
};
exports.SystemController = SystemController;
__decorate([
    (0, common_1.Get)('payment-config'),
    (0, common_1.UseGuards)(universal_auth_guard_1.UniversalAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SystemController.prototype, "getPaymentConfig", null);
__decorate([
    (0, common_1.Patch)('payment-config'),
    (0, common_1.UseGuards)(universal_auth_guard_1.UniversalAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SystemController.prototype, "updatePaymentConfig", null);
__decorate([
    (0, common_1.Get)('public-payment-config'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SystemController.prototype, "getPublicPaymentConfig", null);
exports.SystemController = SystemController = __decorate([
    (0, common_1.Controller)('system'),
    __metadata("design:paramtypes", [system_service_1.SystemService])
], SystemController);
//# sourceMappingURL=system.controller.js.map