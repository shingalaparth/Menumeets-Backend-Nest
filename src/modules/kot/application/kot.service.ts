import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ShopService } from '../../shop/application/shop.service';
import { OrderService } from '../../order/application/order.service';

@Injectable()
export class KOTService {
    constructor(
        private shopService: ShopService,
        private orderService: OrderService,
        private jwtService: JwtService
    ) { }

    async login(shopId: string, pin: string) {
        if (!shopId || !pin) {
            throw new BadRequestException('Shop ID and PIN are required');
        }

        const shop = await this.shopService.getShopById(shopId);
        if (!shop) throw new NotFoundException('Shop not found');

        // Validate PIN
        // Note: In legacy code, PIN stored as string or number. shop.kotPin
        if (!shop.kotPin || String(shop.kotPin) !== String(pin)) {
            throw new UnauthorizedException('Invalid KOT PIN');
        }

        // Issue Token
        const payload = { sub: shop.id, role: 'kot', name: shop.name };
        const token = this.jwtService.sign(payload);

        return {
            success: true,
            token,
            shop: {
                id: shop.id,
                name: shop.name,
                features: (shop.settings as any)?.featureAccess
            }
        };
    }

    async getOrders(shopId: string) {
        // Fetch ACTIVE orders (Accepted, Preparing, Ready)
        // OrderService needs a method for this or we access repo directly.
        // Let's use OrderService to keep it clean, maybe implement getKOTOrders there?
        // Or access repo if OrderService updates are too big.
        // For now, let's assume OrderService has a flexible find method or we add getKOTOrders to it?
        // Adding getShopOrders(shopId, status[]) to OrderService seems best.

        // return this.orderService.getShopOrders(shopId, ['Accepted', 'Placed', 'Preparing', 'Ready']); 
        // Need to implement this in OrderService.

        // Temporary: Access Repo via OrderService if public, or just add method to OrderService.
        // I'll add getKOTOrders(shopId) to OrderService.
        return this.orderService.getKOTOrders(shopId);
    }

    async updateOrderStatus(shopId: string, orderId: string, status: string) {
        const allowed = ['Preparing', 'Ready', 'Completed'];
        if (!allowed.includes(status)) {
            throw new BadRequestException('Invalid KOT status');
        }

        const order = await this.orderService.getOrderById(orderId);
        if (!order) throw new NotFoundException('Order not found');

        // Access check
        if (order.shopId !== shopId) throw new UnauthorizedException('Access denied');

        return this.orderService.updateStatus(orderId, status);
    }
}
