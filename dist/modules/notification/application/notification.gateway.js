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
        }
        catch (e) {
            this.logger.error(`Connection failed: ${e.message}`);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    sendToUser(userId, event, payload) {
        this.server.to(userId).emit(event, payload);
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