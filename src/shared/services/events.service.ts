import { Injectable } from '@nestjs/common';
import { NotificationGateway } from '../../modules/notification/application/notification.gateway';

/**
 * Central event bus for real-time broadcasts.
 * Wraps NotificationGateway to provide typed, domain-specific emit methods.
 * Parity with old Express: io.to(`shop-${shopId}`).emit('eventName', payload)
 */
@Injectable()
export class EventsService {
    constructor(private gateway: NotificationGateway) { }

    // ── Order Events ──

    /** Broadcast when a new order is placed */
    emitNewOrder(shopId: string, order: any) {
        this.gateway.emitToShop(shopId, 'newOrder', order);
    }

    /** Broadcast when order status changes (Pending → Accepted → Preparing → Ready → Completed) */
    emitOrderStatusUpdate(shopId: string, order: any) {
        this.gateway.emitToShop(shopId, 'orderStatusUpdate', {
            orderId: order.id,
            shortOrderId: order.shortOrderId,
            status: order.orderStatus,
            updatedAt: new Date()
        });
        // Also notify the user directly
        if (order.userId) {
            this.gateway.sendToUser(order.userId, 'orderStatusUpdate', {
                orderId: order.id,
                shortOrderId: order.shortOrderId,
                status: order.orderStatus,
                updatedAt: new Date()
            });
        }
    }

    /** Broadcast when order is cancelled */
    emitOrderCancelled(shopId: string, order: any) {
        this.gateway.emitToShop(shopId, 'orderCancelled', {
            orderId: order.id,
            shortOrderId: order.shortOrderId
        });
        if (order.userId) {
            this.gateway.sendToUser(order.userId, 'orderCancelled', {
                orderId: order.id,
                shortOrderId: order.shortOrderId
            });
        }
    }

    // ── KOT Events ──

    /** Broadcast KOT state change */
    emitKotUpdate(shopId: string, data: any) {
        this.gateway.emitToShop(shopId, 'kotUpdate', data);
    }

    // ── Table / Captain Events ──

    /** Broadcast waiter call to shop dashboard */
    emitTableCall(shopId: string, callData: any) {
        this.gateway.emitToShop(shopId, 'tableCall', callData);
        // Parity alias:
        this.gateway.emitToShop(shopId, 'waiterCall', callData);
    }

    /** Broadcast waiter call resolved */
    emitTableCallResolved(shopId: string, callData: any) {
        this.gateway.emitToShop(shopId, 'tableCallResolved', callData);
    }

    /** Broadcast session state change (opened/closed) */
    emitSessionUpdate(shopId: string, session: any) {
        this.gateway.emitToShop(shopId, 'sessionUpdate', session);
    }

    // ── Payment Events ──

    /** Broadcast payment status change */
    emitPaymentUpdate(shopId: string, paymentData: any) {
        this.gateway.emitToShop(shopId, 'paymentUpdate', paymentData);
        if (paymentData.userId) {
            this.gateway.sendToUser(paymentData.userId, 'paymentUpdate', paymentData);
        }
    }
}
