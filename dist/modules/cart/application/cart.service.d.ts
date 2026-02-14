import { CartRepository } from '../domain/cart.repository';
import { MenuService } from '../../menu/application/menu.service';
export declare class CartService {
    private repo;
    private menuService;
    constructor(repo: CartRepository, menuService: MenuService);
    getCart(userId: string): Promise<any>;
    addItem(userId: string, body: any): Promise<any>;
    removeItem(userId: string, itemId: string): Promise<any>;
    clearCart(userId: string): Promise<{
        message: string;
    }>;
    private enrichCart;
}
