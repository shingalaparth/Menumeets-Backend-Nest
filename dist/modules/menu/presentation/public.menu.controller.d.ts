import { MenuService } from '../application/menu.service';
export declare class PublicMenuController {
    private menuService;
    constructor(menuService: MenuService);
    getMenuByQr(qrIdentifier: string): Promise<any>;
}
