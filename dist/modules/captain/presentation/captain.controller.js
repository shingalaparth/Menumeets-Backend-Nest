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
let CaptainController = class CaptainController {
    constructor(captainService) {
        this.captainService = captainService;
    }
    async login(shopId, pin) {
        return this.captainService.login(shopId, pin);
    }
    async getDashboard(req) {
        return this.captainService.getDashboard(req.user.sub);
    }
    async getActiveSessions(req) {
        return this.captainService.getActiveSessions(req.user.sub);
    }
    async getSessionHistory(req, page) {
        return this.captainService.getSessionHistory(req.user.sub, parseInt(page || '1'), 20);
    }
    async startSession(req, body) {
        return this.captainService.startSession(req.user.sub, body);
    }
    async closeSession(req, body) {
        return this.captainService.closeSession(req.user.sub, body.sessionId, body.paymentMethod);
    }
    async getSessionDetails(req, sessionId) {
        return this.captainService.getSessionDetails(req.user.sub, sessionId);
    }
    async splitBill(req, sessionId, splits) {
        return this.captainService.splitBill(req.user.sub, sessionId, splits);
    }
    async printBill(req, sessionId) {
        return this.captainService.printBill(req.user.sub, sessionId);
    }
    async changeTable(req, body) {
        return this.captainService.changeTable(req.user.sub, body.sessionId, body.newTableId);
    }
    async mergeTables(req, body) {
        return this.captainService.mergeTables(req.user.sub, body.sessionId, body.tableIds);
    }
    async callWaiter(req, body) {
        return this.captainService.callWaiter(req.user.sub, body.tableId, body.sessionId);
    }
    async resolveWaiterCall(req, callId) {
        return this.captainService.resolveWaiterCall(req.user.sub, callId);
    }
    async getMenu(req) {
        return this.captainService.getMenu(req.user.sub);
    }
    async placeOrder(req, body) {
        return this.captainService.placeOrder(req.user.sub, body);
    }
    async voidItem(req, body) {
        return this.captainService.voidItem(req.user.sub, body.orderId, body.itemId, body.reason);
    }
    async modifyOrder(req, orderId, body) {
        return this.captainService.modifyOrder(req.user.sub, orderId, body);
    }
};
exports.CaptainController = CaptainController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)('shopId')),
    __param(1, (0, common_1.Body)('pin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CaptainController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(captain_auth_guard_1.CaptainAuthGuard),
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CaptainController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.UseGuards)(captain_auth_guard_1.CaptainAuthGuard),
    (0, common_1.Get)('sessions/active'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CaptainController.prototype, "getActiveSessions", null);
__decorate([
    (0, common_1.UseGuards)(captain_auth_guard_1.CaptainAuthGuard),
    (0, common_1.Get)('sessions/history'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CaptainController.prototype, "getSessionHistory", null);
__decorate([
    (0, common_1.UseGuards)(captain_auth_guard_1.CaptainAuthGuard),
    (0, common_1.Post)('session/start'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CaptainController.prototype, "startSession", null);
__decorate([
    (0, common_1.UseGuards)(captain_auth_guard_1.CaptainAuthGuard),
    (0, common_1.Post)('session/close'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CaptainController.prototype, "closeSession", null);
__decorate([
    (0, common_1.UseGuards)(captain_auth_guard_1.CaptainAuthGuard),
    (0, common_1.Get)('session/:sessionId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CaptainController.prototype, "getSessionDetails", null);
__decorate([
    (0, common_1.UseGuards)(captain_auth_guard_1.CaptainAuthGuard),
    (0, common_1.Post)('session/:sessionId/split-bill'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('sessionId')),
    __param(2, (0, common_1.Body)('splits')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number]),
    __metadata("design:returntype", Promise)
], CaptainController.prototype, "splitBill", null);
__decorate([
    (0, common_1.UseGuards)(captain_auth_guard_1.CaptainAuthGuard),
    (0, common_1.Get)('session/:sessionId/print-bill'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CaptainController.prototype, "printBill", null);
__decorate([
    (0, common_1.UseGuards)(captain_auth_guard_1.CaptainAuthGuard),
    (0, common_1.Post)('session/change-table'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CaptainController.prototype, "changeTable", null);
__decorate([
    (0, common_1.UseGuards)(captain_auth_guard_1.CaptainAuthGuard),
    (0, common_1.Post)('session/merge'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CaptainController.prototype, "mergeTables", null);
__decorate([
    (0, common_1.UseGuards)(captain_auth_guard_1.CaptainAuthGuard),
    (0, common_1.Post)('waiter-call'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CaptainController.prototype, "callWaiter", null);
__decorate([
    (0, common_1.UseGuards)(captain_auth_guard_1.CaptainAuthGuard),
    (0, common_1.Post)('waiter-call/resolve'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('callId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CaptainController.prototype, "resolveWaiterCall", null);
__decorate([
    (0, common_1.UseGuards)(captain_auth_guard_1.CaptainAuthGuard),
    (0, common_1.Get)('menu'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CaptainController.prototype, "getMenu", null);
__decorate([
    (0, common_1.UseGuards)(captain_auth_guard_1.CaptainAuthGuard),
    (0, common_1.Post)('order'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CaptainController.prototype, "placeOrder", null);
__decorate([
    (0, common_1.UseGuards)(captain_auth_guard_1.CaptainAuthGuard),
    (0, common_1.Post)('order/void-item'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CaptainController.prototype, "voidItem", null);
__decorate([
    (0, common_1.UseGuards)(captain_auth_guard_1.CaptainAuthGuard),
    (0, common_1.Patch)('order/:orderId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('orderId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CaptainController.prototype, "modifyOrder", null);
exports.CaptainController = CaptainController = __decorate([
    (0, common_1.Controller)('captain'),
    __metadata("design:paramtypes", [captain_service_1.CaptainService])
], CaptainController);
//# sourceMappingURL=captain.controller.js.map