"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableController = void 0;
const common_1 = require("@nestjs/common");
const vendor_auth_guard_1 = require("../../../shared/guards/vendor-auth.guard");
const current_user_decorator_1 = require("../../../shared/decorators/current-user.decorator");
const table_service_1 = require("../application/table.service");
let TableController = class TableController {
    constructor(tableService) {
        this.tableService = tableService;
    }
    createTable(shopId, vendor, body) {
        return this.tableService.createTable(shopId, vendor, body);
    }
    getTables(shopId, vendor) {
        return this.tableService.getTablesForShop(shopId, vendor);
    }
    deleteAllTables(shopId, vendor) {
        return this.tableService.deleteAllTables(shopId, vendor);
    }
    updateTable(shopId, qr, vendor, body) {
        return this.tableService.updateTable(shopId, qr, vendor, body);
    }
    deleteTable(shopId, qr, vendor) {
        return this.tableService.deleteTable(shopId, qr, vendor);
    }
    startSession(shopId, vendor, body) {
        return this.tableService.startSession(shopId, vendor, body);
    }
    closeSession(shopId, sessionId, vendor) {
        return this.tableService.closeSession(shopId, sessionId, vendor);
    }
    getSession(shopId, sessionId, vendor) {
        return this.tableService.getSessionDetails(shopId, sessionId, vendor);
    }
    changeSession(shopId, vendor, body) {
        return this.tableService.changeTableSession(shopId, vendor, body);
    }
    mergeSession(shopId, vendor, body) {
        return this.tableService.mergeTableSession(shopId, vendor, body);
    }
    unmergeSession(shopId, vendor, body) {
        return this.tableService.unmergeTableSession(shopId, vendor, body);
    }
    placeOrder(shopId, vendor, body) {
        return this.tableService.placeTableOrder(shopId, vendor, body);
    }
};
exports.TableController = TableController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, current_user_decorator_1.CurrentVendor)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], TableController.prototype, "createTable", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, current_user_decorator_1.CurrentVendor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TableController.prototype, "getTables", null);
__decorate([
    (0, common_1.Delete)('all'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, current_user_decorator_1.CurrentVendor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TableController.prototype, "deleteAllTables", null);
__decorate([
    (0, common_1.Patch)(':qrIdentifier'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, common_1.Param)('qrIdentifier')),
    __param(2, (0, current_user_decorator_1.CurrentVendor)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", void 0)
], TableController.prototype, "updateTable", null);
__decorate([
    (0, common_1.Delete)(':qrIdentifier'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, common_1.Param)('qrIdentifier')),
    __param(2, (0, current_user_decorator_1.CurrentVendor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], TableController.prototype, "deleteTable", null);
__decorate([
    (0, common_1.Post)('sessions/start'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, current_user_decorator_1.CurrentVendor)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], TableController.prototype, "startSession", null);
__decorate([
    (0, common_1.Post)('sessions/:sessionId/close'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, common_1.Param)('sessionId')),
    __param(2, (0, current_user_decorator_1.CurrentVendor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], TableController.prototype, "closeSession", null);
__decorate([
    (0, common_1.Get)('sessions/:sessionId'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, common_1.Param)('sessionId')),
    __param(2, (0, current_user_decorator_1.CurrentVendor)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], TableController.prototype, "getSession", null);
__decorate([
    (0, common_1.Post)('sessions/change'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, current_user_decorator_1.CurrentVendor)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], TableController.prototype, "changeSession", null);
__decorate([
    (0, common_1.Post)('sessions/merge'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, current_user_decorator_1.CurrentVendor)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], TableController.prototype, "mergeSession", null);
__decorate([
    (0, common_1.Post)('sessions/unmerge'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, current_user_decorator_1.CurrentVendor)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], TableController.prototype, "unmergeSession", null);
__decorate([
    (0, common_1.Post)('sessions/order'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, current_user_decorator_1.CurrentVendor)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], TableController.prototype, "placeOrder", null);
exports.TableController = TableController = __decorate([
    (0, common_1.Controller)('shops/:shopId/tables'),
    (0, common_1.UseGuards)(vendor_auth_guard_1.VendorAuthGuard),
    __metadata("design:paramtypes", [table_service_1.TableService])
], TableController);
//# sourceMappingURL=table.controller.js.map