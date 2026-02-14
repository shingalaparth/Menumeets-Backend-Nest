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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const notification_repository_1 = require("../domain/notification.repository");
const notification_gateway_1 = require("./notification.gateway");
let NotificationService = class NotificationService {
    constructor(repo, gateway) {
        this.repo = repo;
        this.gateway = gateway;
    }
    async sendNotification(data) {
        const notification = await this.repo.create({
            userId: data.userId,
            vendorId: data.vendorId,
            title: data.title,
            body: data.body,
            type: data.type || 'INFO',
            metadata: data.metadata,
            isRead: false
        });
        if (data.userId) {
            this.gateway.sendToUser(data.userId, 'notification', notification);
        }
        if (data.vendorId) {
            this.gateway.sendToUser(data.vendorId, 'notification', notification);
        }
        return notification;
    }
    async getUserNotifications(userId) {
        return this.repo.findByUserId(userId);
    }
    async getVendorNotifications(vendorId) {
        return this.repo.findByVendorId(vendorId);
    }
    async markAsRead(id) {
        return this.repo.markAsRead(id);
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(notification_repository_1.NOTIFICATION_REPOSITORY)),
    __metadata("design:paramtypes", [Object, notification_gateway_1.NotificationGateway])
], NotificationService);
//# sourceMappingURL=notification.service.js.map