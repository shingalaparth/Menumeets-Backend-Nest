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
    handleJoinShop(client: Socket, data: {
        shopId: string;
    }): {
        event: string;
        data: {
            shopId: string;
        };
    } | undefined;
    handleLeaveShop(client: Socket, data: {
        shopId: string;
    }): {
        event: string;
        data: {
            shopId: string;
        };
    } | undefined;
    sendToUser(userId: string, event: string, payload: any): void;
    emitToShop(shopId: string, event: string, payload: any): void;
    broadcast(event: string, payload: any): void;
    private extractToken;
}
