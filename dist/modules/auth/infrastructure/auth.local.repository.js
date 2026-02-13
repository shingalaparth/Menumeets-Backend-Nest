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
exports.AuthLocalRepository = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_util_1 = require("../../../shared/utils/jwt.util");
const hash_util_1 = require("../../../shared/utils/hash.util");
let AuthLocalRepository = class AuthLocalRepository {
    constructor(configService) {
        this.configService = configService;
        this.secret = this.configService.get('jwt.secret', '');
    }
    createToken(payload, expiresIn) {
        return (0, jwt_util_1.createJWT)(payload, this.secret, expiresIn);
    }
    verifyToken(token) {
        try {
            return (0, jwt_util_1.verifyJWT)(token, this.secret);
        }
        catch {
            return null;
        }
    }
    async hashPassword(plain) {
        return (0, hash_util_1.hashPassword)(plain);
    }
    async comparePassword(plain, hashed) {
        return (0, hash_util_1.comparePassword)(plain, hashed);
    }
};
exports.AuthLocalRepository = AuthLocalRepository;
exports.AuthLocalRepository = AuthLocalRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AuthLocalRepository);
//# sourceMappingURL=auth.local.repository.js.map