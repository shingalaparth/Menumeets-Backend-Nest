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
exports.InvoiceController = void 0;
const common_1 = require("@nestjs/common");
const invoice_service_1 = require("../application/invoice.service");
const user_auth_guard_1 = require("../../../shared/guards/user-auth.guard");
const vendor_auth_guard_1 = require("../../../shared/guards/vendor-auth.guard");
const universal_auth_guard_1 = require("../../../shared/guards/universal-auth.guard");
let InvoiceController = class InvoiceController {
    constructor(invoiceService) {
        this.invoiceService = invoiceService;
    }
    async getShopInvoices(shopId, page, limit) {
        return this.invoiceService.getShopInvoices(shopId, parseInt(page || '1'), parseInt(limit || '20'));
    }
    async getMyInvoices(req) {
        return this.invoiceService.getMyInvoices(req.user.sub);
    }
    async getInvoiceById(id) {
        return this.invoiceService.getInvoiceById(id);
    }
    async updateInvoiceStatus(id, status) {
        return this.invoiceService.updateInvoiceStatus(id, status);
    }
    async downloadInvoice(invoiceNumber, res) {
        const invoice = await this.invoiceService.getInvoiceByNumber(invoiceNumber);
        return this.invoiceService.generateInvoicePDF(invoice, res);
    }
    async downloadInvoiceByOrder(orderId, res) {
        const invoice = await this.invoiceService.getInvoiceByOrderId(orderId);
        return this.invoiceService.generateInvoicePDF(invoice, res);
    }
    async generateInvoiceFromParentOrder(orderId) {
        return this.invoiceService.generateInvoiceFromParentOrder({ id: orderId });
    }
};
exports.InvoiceController = InvoiceController;
__decorate([
    (0, common_1.UseGuards)(vendor_auth_guard_1.VendorAuthGuard),
    (0, common_1.Get)('shop/:shopId'),
    __param(0, (0, common_1.Param)('shopId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "getShopInvoices", null);
__decorate([
    (0, common_1.UseGuards)(user_auth_guard_1.UserAuthGuard),
    (0, common_1.Get)('my'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "getMyInvoices", null);
__decorate([
    (0, common_1.UseGuards)(universal_auth_guard_1.UniversalAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "getInvoiceById", null);
__decorate([
    (0, common_1.UseGuards)(vendor_auth_guard_1.VendorAuthGuard),
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "updateInvoiceStatus", null);
__decorate([
    (0, common_1.UseGuards)(universal_auth_guard_1.UniversalAuthGuard),
    (0, common_1.Get)('download/:invoiceNumber'),
    __param(0, (0, common_1.Param)('invoiceNumber')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "downloadInvoice", null);
__decorate([
    (0, common_1.UseGuards)(universal_auth_guard_1.UniversalAuthGuard),
    (0, common_1.Get)('order/:orderId/download'),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "downloadInvoiceByOrder", null);
__decorate([
    (0, common_1.UseGuards)(vendor_auth_guard_1.VendorAuthGuard),
    (0, common_1.Post)('from-parent-order/:orderId'),
    __param(0, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "generateInvoiceFromParentOrder", null);
exports.InvoiceController = InvoiceController = __decorate([
    (0, common_1.Controller)('invoices'),
    __metadata("design:paramtypes", [invoice_service_1.InvoiceService])
], InvoiceController);
//# sourceMappingURL=invoice.controller.js.map