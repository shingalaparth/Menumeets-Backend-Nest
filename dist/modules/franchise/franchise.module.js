"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FranchiseModule = void 0;
const common_1 = require("@nestjs/common");
const franchise_controller_1 = require("./presentation/franchise.controller");
const franchise_menu_controller_1 = require("./presentation/franchise-menu.controller");
const franchise_service_1 = require("./application/franchise.service");
const franchise_repository_1 = require("./domain/franchise.repository");
const franchise_prisma_repository_1 = require("./infrastructure/franchise.prisma.repository");
const shop_module_1 = require("../shop/shop.module");
let FranchiseModule = class FranchiseModule {
};
exports.FranchiseModule = FranchiseModule;
exports.FranchiseModule = FranchiseModule = __decorate([
    (0, common_1.Module)({
        imports: [shop_module_1.ShopModule],
        controllers: [franchise_controller_1.FranchiseController, franchise_menu_controller_1.FranchiseMenuController],
        providers: [
            franchise_service_1.FranchiseService,
            {
                provide: franchise_repository_1.FRANCHISE_REPOSITORY,
                useClass: franchise_prisma_repository_1.FranchisePrismaRepository,
            },
        ],
        exports: [franchise_service_1.FranchiseService],
    })
], FranchiseModule);
//# sourceMappingURL=franchise.module.js.map