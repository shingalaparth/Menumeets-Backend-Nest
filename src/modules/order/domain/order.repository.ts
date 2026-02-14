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

    // ── Parity additions ──
    findActiveByShopId(shopId: string): Promise<Order[]>;
    updateOrder(orderId: string, data: any): Promise<Order>;
    findByShopIdPaginated(shopId: string, page: number, limit: number, filters?: any): Promise<{ orders: Order[]; total: number }>;

    // ── Analytics & Parity ──
    getAnalytics(shopId: string, startDate: Date, endDate: Date): Promise<any>;
    updateOrderItemQuantity(orderId: string, itemId: string, quantity: number): Promise<any>;
}

export const ORDER_REPOSITORY = 'ORDER_REPOSITORY';
