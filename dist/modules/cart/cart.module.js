"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartModule = void 0;
const common_1 = require("@nestjs/common");
const cart_controller_1 = require("./presentation/cart.controller");
const cart_service_1 = require("./application/cart.service");
const cart_repository_1 = require("./domain/cart.repository");
const cart_prisma_repository_1 = require("./infrastructure/cart.prisma.repository");
const menu_module_1 = require("../menu/menu.module");
let CartModule = class CartModule {
};
exports.CartModule = CartModule;
exports.CartModule = CartModule = __decorate([
    (0, common_1.Module)({
        imports: [menu_module_1.MenuModule],
        controllers: [cart_controller_1.CartController],
        providers: [
            cart_service_1.CartService,
            { provide: cart_repository_1.CART_REPOSITORY, useClass: cart_prisma_repository_1.CartPrismaRepository }
        ],
        exports: [cart_service_1.CartService, cart_repository_1.CART_REPOSITORY]
    })
], CartModule);
//# sourceMappingURL=cart.module.js.map