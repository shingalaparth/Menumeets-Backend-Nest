"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryModule = void 0;
const common_1 = require("@nestjs/common");
const inventory_controller_1 = require("./presentation/inventory.controller");
const inventory_service_1 = require("./application/inventory.service");
const inventory_prisma_repository_1 = require("./infrastructure/inventory.prisma.repository");
const inventory_repository_1 = require("./domain/inventory.repository");
const notification_module_1 = require("../notification/notification.module");
let InventoryModule = class InventoryModule {
};
exports.InventoryModule = InventoryModule;
exports.InventoryModule = InventoryModule = __decorate([
    (0, common_1.Module)({
        imports: [notification_module_1.NotificationModule],
        controllers: [inventory_controller_1.InventoryController],
        providers: [
            inventory_service_1.InventoryService,
            {
                provide: inventory_repository_1.INVENTORY_REPOSITORY,
                useClass: inventory_prisma_repository_1.InventoryPrismaRepository,
            },
        ],
        exports: [inventory_service_1.InventoryService],
    })
], InventoryModule);
//# sourceMappingURL=inventory.module.js.map