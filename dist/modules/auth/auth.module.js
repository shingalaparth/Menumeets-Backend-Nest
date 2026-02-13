"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./application/auth.service");
const auth_controller_1 = require("./presentation/auth.controller");
const auth_repository_1 = require("./domain/auth.repository");
const auth_local_repository_1 = require("./infrastructure/auth.local.repository");
const user_module_1 = require("../user/user.module");
const vendor_module_1 = require("../vendor/vendor.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [user_module_1.UserModule, vendor_module_1.VendorModule],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            {
                provide: auth_repository_1.AUTH_REPOSITORY,
                useClass: auth_local_repository_1.AuthLocalRepository,
            },
        ],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map