import { Order, OrderItem } from '@prisma/client';

export interface OrderRepository {
    createOrder(data: any): Promise<Order>;
    createOrderItem(data: any): Promise<OrderItem>;
    findById(orderId: string): Promise<Order | null>;
    findByShortId(shortId: string): Promise<Order | null>;
    updateStatus(orderId: string, status: string): Promise<Order>;
    updatePaymentStatus(orderId: string, status: string, paymentDetails?: any): Promise<Order>;
    findByUserId(userId: string): Promise<Order[]>;
    findByShopId(shopId: string): Promise<Order[]>;
    findKOTOrders(shopId: string): Promise<Order[]>;
    findByTableSessionId(sessionId: string): Promise<Order[]>;
}

export const ORDER_REPOSITORY = 'ORDER_REPOSITORY';
