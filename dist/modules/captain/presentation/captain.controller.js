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
exports.CaptainController = void 0;
const common_1 = require("@nestjs/common");
const captain_service_1 = require("../application/captain.service");
const captain_auth_guard_1 = require("../../../shared/guards/captain-auth.guard");
const current_user_decorator_1 = require("../../../shared/decorators/current-user.decorator");
let CaptainController = class CaptainController {
    constructor(captainService) {
        this.captainService = captainService;
    }
    async login(body) {
        return this.captainService.login(body.shopId, body.pin);
    }
    async getDashboard(shop) {
        return this.captainService.getDashboard(shop.id);
    }
    async startSession(shop, body) {
        return this.captainService.startSession(shop.id, body);
    }
    async closeSession(shop, body) {
        return this.captainService.closeSession(shop.id, body.sessionId, body.paymentMethod);
    }
};
exports.CaptainController = CaptainController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CaptainController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('tables'),
    (0, common_1.UseGuards)(captain_auth_guard_1.CaptainAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CaptainController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Post)('session/start'),
    (0, common_1.UseGuards)(captain_auth_guard_1.CaptainAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CaptainController.prototype, "startSession", null);
__decorate([
    (0, common_1.Post)('session/close'),
    (0, common_1.UseGuards)(captain_auth_guard_1.CaptainAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CaptainController.prototype, "closeSession", null);
exports.CaptainController = CaptainController = __decorate([
    (0, common_1.Controller)('captain'),
    __metadata("design:paramtypes", [captain_service_1.CaptainService])
], CaptainController);
//# sourceMappingURL=captain.controller.js.map