"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodCourtModule = void 0;
const common_1 = require("@nestjs/common");
const food_court_controller_1 = require("./presentation/food-court.controller");
const food_court_service_1 = require("./application/food-court.service");
const food_court_repository_1 = require("./domain/food-court.repository");
const food_court_prisma_repository_1 = require("./infrastructure/food-court.prisma.repository");
const shop_module_1 = require("../shop/shop.module");
let FoodCourtModule = class FoodCourtModule {
};
exports.FoodCourtModule = FoodCourtModule;
exports.FoodCourtModule = FoodCourtModule = __decorate([
    (0, common_1.Module)({
        imports: [shop_module_1.ShopModule],
        controllers: [food_court_controller_1.FoodCourtController],
        providers: [
            food_court_service_1.FoodCourtService,
            {
                provide: food_court_repository_1.FOOD_COURT_REPOSITORY,
                useClass: food_court_prisma_repository_1.FoodCourtPrismaRepository,
            },
        ],
        exports: [food_court_service_1.FoodCourtService],
    })
], FoodCourtModule);
//# sourceMappingURL=food-court.module.js.map