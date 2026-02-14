"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuModule = void 0;
const common_1 = require("@nestjs/common");
const menu_service_1 = require("./application/menu.service");
const menu_controller_1 = require("./presentation/menu.controller");
const public_menu_controller_1 = require("./presentation/public.menu.controller");
const menu_repository_1 = require("./domain/menu.repository");
const menu_prisma_repository_1 = require("./infrastructure/menu.prisma.repository");
const shop_module_1 = require("../shop/shop.module");
const table_module_1 = require("../table/table.module");
const redis_module_1 = require("../../infrastructure/cache/redis.module");
const global_menu_service_1 = require("./application/global-menu.service");
const global_menu_controller_1 = require("./presentation/global-menu.controller");
let MenuModule = class MenuModule {
};
exports.MenuModule = MenuModule;
exports.MenuModule = MenuModule = __decorate([
    (0, common_1.Module)({
        imports: [shop_module_1.ShopModule, table_module_1.TableModule, redis_module_1.RedisModule],
        controllers: [menu_controller_1.MenuController, public_menu_controller_1.PublicMenuController, global_menu_controller_1.GlobalMenuController],
        providers: [
            menu_service_1.MenuService,
            global_menu_service_1.GlobalMenuService,
            {
                provide: menu_repository_1.MENU_REPOSITORY,
                useClass: menu_prisma_repository_1.MenuPrismaRepository,
            },
        ],
        exports: [menu_service_1.MenuService, global_menu_service_1.GlobalMenuService],
    })
], MenuModule);
//# sourceMappingURL=menu.module.js.map