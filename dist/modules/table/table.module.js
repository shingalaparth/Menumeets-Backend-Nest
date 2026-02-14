"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableModule = void 0;
const common_1 = require("@nestjs/common");
const table_service_1 = require("./application/table.service");
const table_controller_1 = require("./presentation/table.controller");
const table_repository_1 = require("./domain/table.repository");
const table_prisma_repository_1 = require("./infrastructure/table.prisma.repository");
const shop_module_1 = require("../shop/shop.module");
let TableModule = class TableModule {
};
exports.TableModule = TableModule;
exports.TableModule = TableModule = __decorate([
    (0, common_1.Module)({
        imports: [shop_module_1.ShopModule],
        controllers: [table_controller_1.TableController],
        providers: [
            table_service_1.TableService,
            {
                provide: table_repository_1.TABLE_REPOSITORY,
                useClass: table_prisma_repository_1.TablePrismaRepository,
            },
        ],
        exports: [table_service_1.TableService],
    })
], TableModule);
//# sourceMappingURL=table.module.js.map