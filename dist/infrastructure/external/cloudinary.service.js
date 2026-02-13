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
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cloudinary_1 = require("cloudinary");
let CloudinaryService = class CloudinaryService {
    constructor(configService) {
        this.configService = configService;
        cloudinary_1.v2.config({
            cloud_name: this.configService.get('cloudinary.cloudName'),
            api_key: this.configService.get('cloudinary.apiKey'),
            api_secret: this.configService.get('cloudinary.apiSecret'),
        });
    }
    async uploadImage(fileBuffer, folder = 'menumeets/menu-items', transformation) {
        const defaultTransform = transformation || { width: 800, height: 600, crop: 'fill' };
        return new Promise((resolve, reject) => {
            cloudinary_1.v2.uploader
                .upload_stream({
                folder,
                allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
                transformation: [{ ...defaultTransform, quality: 'auto' }],
            }, (error, result) => {
                if (error || !result)
                    return reject(error || new Error('Upload failed'));
                resolve(result);
            })
                .end(fileBuffer);
        });
    }
    async uploadQRCode(fileBuffer) {
        return this.uploadImage(fileBuffer, 'menumeets/qr-codes', {
            width: 400,
            height: 400,
            crop: 'fit',
        });
    }
    async deleteImage(publicId) {
        await cloudinary_1.v2.uploader.destroy(publicId);
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map