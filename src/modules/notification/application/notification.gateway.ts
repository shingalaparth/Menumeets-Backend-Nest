import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { verifyJWT } from '../../../shared/utils/jwt.util';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
    cors: {
        origin: '*', // Adjust for production
    },
})
@Injectable()
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server!: Server;
    private logger: Logger = new Logger('NotificationGateway');

    // Map usage: userId -> SocketId[] (User might have multiple tabs open)
    private userSockets: Map<string, string[]> = new Map();

    constructor(private configService: ConfigService) { }

    async handleConnection(client: Socket) {
        try {
            const token = this.extractToken(client);
            if (!token) {
                client.disconnect();
                return;
            }

            const secret = this.configService.get<string>('jwt.secret', '');
            const decoded = verifyJWT(token, secret);
            const userId = (decoded.sub || decoded.id) as string;

            if (!userId) {
                client.disconnect();
                return;
            }

            this.logger.log(`Client connected: ${client.id} (User: ${userId})`);

            const sockets = this.userSockets.get(userId) || [];
            sockets.push(client.id);
            this.userSockets.set(userId, sockets);

            // Join a room named after the userId for easier broadcasting
            client.join(userId);

            // Store userId on the socket for later use
            (client as any).userId = userId;

        } catch (e: any) {
            this.logger.error(`Connection failed: ${e.message}`);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
        const userId = (client as any).userId;
        if (userId) {
            const sockets = this.userSockets.get(userId) || [];
            const filtered = sockets.filter(s => s !== client.id);
            if (filtered.length > 0) {
                this.userSockets.set(userId, filtered);
            } else {
                this.userSockets.delete(userId);
            }
        }
    }

    // ── Shop Room Management (Parity with old io.to(`shop-${shopId}`)) ──

    @SubscribeMessage('joinShopRoom')
    handleJoinShop(@ConnectedSocket() client: Socket, @MessageBody() data: { shopId: string }) {
        if (!data?.shopId) return;
        const room = `shop-${data.shopId}`;
        client.join(room);
        this.logger.log(`Client ${client.id} joined ${room}`);
        return { event: 'joinedShopRoom', data: { shopId: data.shopId } };
    }

    @SubscribeMessage('leaveShopRoom')
    handleLeaveShop(@ConnectedSocket() client: Socket, @MessageBody() data: { shopId: string }) {
        if (!data?.shopId) return;
        const room = `shop-${data.shopId}`;
        client.leave(room);
        this.logger.log(`Client ${client.id} left ${room}`);
        return { event: 'leftShopRoom', data: { shopId: data.shopId } };
    }

    // ── Public Broadcasting Methods ──

    /** Send to a specific user by userId */
    sendToUser(userId: string, event: string, payload: any) {
        this.server.to(userId).emit(event, payload);
    }

    /** Broadcast to all clients in a shop room — parity with io.to(`shop-${shopId}`).emit(...) */
    emitToShop(shopId: string, event: string, payload: any) {
        this.server.to(`shop-${shopId}`).emit(event, payload);
    }

    /** Broadcast to all connected clients */
    broadcast(event: string, payload: any) {
        this.server.emit(event, payload);
    }

    private extractToken(client: Socket): string | null {
        let auth: string | undefined;
        if (client.handshake.headers.authorization) auth = client.handshake.headers.authorization as string;
        else if (client.handshake.auth.token) auth = client.handshake.auth.token as string;
        else return null;
        if (typeof auth === 'string' && auth.startsWith('Bearer ')) {
            return auth.split(' ')[1];
        }
        return auth as string || null;
    }
}
