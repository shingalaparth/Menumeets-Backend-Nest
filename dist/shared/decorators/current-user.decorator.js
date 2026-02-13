"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentVendor = exports.CurrentUser = void 0;
const common_1 = require("@nestjs/common");
exports.CurrentUser = (0, common_1.createParamDecorator)((_data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});
exports.CurrentVendor = (0, common_1.createParamDecorator)((_data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.vendor;
});
//# sourceMappingURL=current-user.decorator.js.map