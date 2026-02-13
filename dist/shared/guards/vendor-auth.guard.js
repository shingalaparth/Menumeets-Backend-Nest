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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
const jwt_util_1 = require("../utils/jwt.util");
let VendorAuthGuard = class VendorAuthGuard {
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractToken(request);
        if (!token) {
            throw new common_1.UnauthorizedException('Not authorized, token missing');
        }
        try {
            const secret = this.configService.get('jwt.secret', '');
            const decoded = (0, jwt_util_1.verifyJWT)(token, secret);
            if (decoded.role === 'admin') {
                request.vendor = { id: 'admin', role: 'admin', name: 'Administrator' };
                return true;
            }
            request.vendor = decoded;
            return true;
        }
        catch {
            throw new common_1.UnauthorizedException('Not authorized, invalid token');
        }
    }
    extractToken(request) {
        if (request.cookies?.token)
            return request.cookies.token;
        const auth = request.headers?.authorization;
        if (auth?.startsWith('Bearer '))
            return auth.split(' ')[1];
        return null;
    }
};
exports.VendorAuthGuard = VendorAuthGuard;
exports.VendorAuthGuard = VendorAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], VendorAuthGuard);
//# sourceMappingURL=vendor-auth.guard.js.map