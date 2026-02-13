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
exports.CaptainAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_util_1 = require("../utils/jwt.util");
let CaptainAuthGuard = class CaptainAuthGuard {
    constructor(configService) {
        this.configService = configService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const auth = request.headers?.authorization;
        if (!auth?.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('Not authorized within Captain App');
        }
        const token = auth.split(' ')[1];
        try {
            const secret = this.configService.get('jwt.secret', '');
            const decoded = (0, jwt_util_1.verifyJWT)(token, secret);
            if (decoded.role !== 'captain') {
                throw new common_1.ForbiddenException('Access denied. Captain role required.');
            }
            request.user = decoded;
            return true;
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException)
                throw error;
            throw new common_1.UnauthorizedException('Session expired or invalid');
        }
    }
};
exports.CaptainAuthGuard = CaptainAuthGuard;
exports.CaptainAuthGuard = CaptainAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CaptainAuthGuard);
//# sourceMappingURL=captain-auth.guard.js.map