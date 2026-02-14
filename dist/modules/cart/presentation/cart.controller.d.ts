import { CartService } from '../application/cart.service';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getMyCart(user: any): Promise<any>;
    addItem(user: any, body: any): Promise<any>;
    removeItem(user: any, itemId: string): Promise<any>;
    clearCart(user: any): Promise<{
        message: string;
    }>;
}
