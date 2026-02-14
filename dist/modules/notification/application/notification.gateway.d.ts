import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
export declare class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private configService;
    server: Server;
    private logger;
    private userSockets;
    constructor(configService: ConfigService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    sendToUser(userId: string, event: string, payload: any): void;
    private extractToken;
}
