/**
 * Cloudinary Config — migrated from old config/env.js cloudinary section
 * Upload logic (storage, multer) moves to infrastructure/external/cloudinary.service.ts
 */
import { registerAs } from '@nestjs/config';

export default registerAs('cloudinary', () => ({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
}));
