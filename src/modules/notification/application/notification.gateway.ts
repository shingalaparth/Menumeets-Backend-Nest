import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
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
            const userId = (decoded.sub || decoded.id) as string; // Support both User and Vendor tokens

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

        } catch (e: any) {
            this.logger.error(`Connection failed: ${e.message}`);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
        // Cleanup logic would go here (remove from Map)
        // For brevity/performance, maybe just rely on rooms which clean themselves up on disconnect
    }

    // Public method to send notifications
    sendToUser(userId: string, event: string, payload: any) {
        // Broadcast to the user's room
        this.server.to(userId).emit(event, payload);
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
