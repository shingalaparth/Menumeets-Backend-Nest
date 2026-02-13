/**
 * Cloudinary Service — migrated from old config/cloudinary.js
 *
 * Old: cloudinary.config() + multer storage + upload middleware
 * New: Injectable service with same upload logic
 */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
    constructor(private configService: ConfigService) {
        cloudinary.config({
            cloud_name: this.configService.get<string>('cloudinary.cloudName'),
            api_key: this.configService.get<string>('cloudinary.apiKey'),
            api_secret: this.configService.get<string>('cloudinary.apiSecret'),
        });
    }

    /**
     * Upload an image buffer to Cloudinary
     * Replaces old multer-storage-cloudinary pattern
     */
    async uploadImage(
        fileBuffer: Buffer,
        folder = 'menumeets/menu-items',
        transformation?: { width: number; height: number; crop: string },
    ): Promise<UploadApiResponse> {
        const defaultTransform = transformation || { width: 800, height: 600, crop: 'fill' };

        return new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        folder,
                        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
                        transformation: [{ ...defaultTransform, quality: 'auto' }],
                    },
                    (error, result) => {
                        if (error || !result) return reject(error || new Error('Upload failed'));
                        resolve(result);
                    },
                )
                .end(fileBuffer);
        });
    }

    /**
     * Upload QR code image (smaller dimensions)
     * Replaces old uploadQR multer storage
     */
    async uploadQRCode(fileBuffer: Buffer): Promise<UploadApiResponse> {
        return this.uploadImage(fileBuffer, 'menumeets/qr-codes', {
            width: 400,
            height: 400,
            crop: 'fit',
        });
    }

    /** Delete an image by public_id */
    async deleteImage(publicId: string): Promise<void> {
        await cloudinary.uploader.destroy(publicId);
    }
}
