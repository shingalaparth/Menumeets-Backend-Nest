"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopModule = void 0;
const common_1 = require("@nestjs/common");
const shop_service_1 = require("./application/shop.service");
const shop_controller_1 = require("./presentation/shop.controller");
const shop_repository_1 = require("./domain/shop.repository");
const shop_prisma_repository_1 = require("./infrastructure/shop.prisma.repository");
const shop_request_repository_1 = require("./domain/shop-request.repository");
const shop_request_prisma_repository_1 = require("./infrastructure/shop-request.prisma.repository");
let ShopModule = class ShopModule {
};
exports.ShopModule = ShopModule;
exports.ShopModule = ShopModule = __decorate([
    (0, common_1.Module)({
        controllers: [shop_controller_1.ShopController],
        providers: [
            shop_service_1.ShopService,
            {
                provide: shop_repository_1.SHOP_REPOSITORY,
                useClass: shop_prisma_repository_1.ShopPrismaRepository,
            },
            {
                provide: shop_request_repository_1.SHOP_REQUEST_REPOSITORY,
                useClass: shop_request_prisma_repository_1.ShopRequestPrismaRepository,
            },
        ],
        exports: [shop_service_1.ShopService, shop_request_repository_1.SHOP_REQUEST_REPOSITORY],
    })
], ShopModule);
//# sourceMappingURL=shop.module.js.map