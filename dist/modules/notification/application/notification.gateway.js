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
exports.NotificationGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const jwt_util_1 = require("../../../shared/utils/jwt.util");
const config_1 = require("@nestjs/config");
let NotificationGateway = class NotificationGateway {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger('NotificationGateway');
        this.userSockets = new Map();
    }
    async handleConnection(client) {
        try {
            const token = this.extractToken(client);
            if (!token) {
                client.disconnect();
                return;
            }
            const secret = this.configService.get('jwt.secret', '');
            const decoded = (0, jwt_util_1.verifyJWT)(token, secret);
            const userId = (decoded.sub || decoded.id);
            if (!userId) {
                client.disconnect();
                return;
            }
            this.logger.log(`Client connected: ${client.id} (User: ${userId})`);
            const sockets = this.userSockets.get(userId) || [];
            sockets.push(client.id);
            this.userSockets.set(userId, sockets);
            client.join(userId);
            client.userId = userId;
        }
        catch (e) {
            this.logger.error(`Connection failed: ${e.message}`);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
        const userId = client.userId;
        if (userId) {
            const sockets = this.userSockets.get(userId) || [];
            const filtered = sockets.filter(s => s !== client.id);
            if (filtered.length > 0) {
                this.userSockets.set(userId, filtered);
            }
            else {
                this.userSockets.delete(userId);
            }
        }
    }
    handleJoinShop(client, data) {
        if (!data?.shopId)
            return;
        const room = `shop-${data.shopId}`;
        client.join(room);
        this.logger.log(`Client ${client.id} joined ${room}`);
        return { event: 'joinedShopRoom', data: { shopId: data.shopId } };
    }
    handleLeaveShop(client, data) {
        if (!data?.shopId)
            return;
        const room = `shop-${data.shopId}`;
        client.leave(room);
        this.logger.log(`Client ${client.id} left ${room}`);
        return { event: 'leftShopRoom', data: { shopId: data.shopId } };
    }
    sendToUser(userId, event, payload) {
        this.server.to(userId).emit(event, payload);
    }
    emitToShop(shopId, event, payload) {
        this.server.to(`shop-${shopId}`).emit(event, payload);
    }
    broadcast(event, payload) {
        this.server.emit(event, payload);
    }
    extractToken(client) {
        let auth;
        if (client.handshake.headers.authorization)
            auth = client.handshake.headers.authorization;
        else if (client.handshake.auth.token)
            auth = client.handshake.auth.token;
        else
            return null;
        if (typeof auth === 'string' && auth.startsWith('Bearer ')) {
            return auth.split(' ')[1];
        }
        return auth || null;
    }
};
exports.NotificationGateway = NotificationGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinShopRoom'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], NotificationGateway.prototype, "handleJoinShop", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveShopRoom'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], NotificationGateway.prototype, "handleLeaveShop", null);
exports.NotificationGateway = NotificationGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], NotificationGateway);
//# sourceMappingURL=notification.gateway.js.map