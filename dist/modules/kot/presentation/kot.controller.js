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
exports.KOTController = void 0;
const common_1 = require("@nestjs/common");
const kot_service_1 = require("../application/kot.service");
const kot_auth_guard_1 = require("../../../shared/guards/kot-auth.guard");
const current_user_decorator_1 = require("../../../shared/decorators/current-user.decorator");
let KOTController = class KOTController {
    constructor(kotService) {
        this.kotService = kotService;
    }
    async login(body) {
        return this.kotService.login(body.shopId, body.pin);
    }
    async getKOTOrders(shop) {
        return this.kotService.getOrders(shop.id);
    }
    async updateOrderStatus(shop, orderId, body) {
        return this.kotService.updateOrderStatus(shop.id, orderId, body.status);
    }
};
exports.KOTController = KOTController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], KOTController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('orders'),
    (0, common_1.UseGuards)(kot_auth_guard_1.KotAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], KOTController.prototype, "getKOTOrders", null);
__decorate([
    (0, common_1.Put)('orders/:orderId/status'),
    (0, common_1.UseGuards)(kot_auth_guard_1.KotAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('orderId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], KOTController.prototype, "updateOrderStatus", null);
exports.KOTController = KOTController = __decorate([
    (0, common_1.Controller)('kot'),
    __metadata("design:paramtypes", [kot_service_1.KOTService])
], KOTController);
//# sourceMappingURL=kot.controller.js.map