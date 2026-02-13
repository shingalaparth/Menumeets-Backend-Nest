import { ConfigService } from '@nestjs/config';
import { UploadApiResponse } from 'cloudinary';
export declare class CloudinaryService {
    private configService;
    constructor(configService: ConfigService);
    uploadImage(fileBuffer: Buffer, folder?: string, transformation?: {
        width: number;
        height: number;
        crop: string;
    }): Promise<UploadApiResponse>;
    uploadQRCode(fileBuffer: Buffer): Promise<UploadApiResponse>;
    deleteImage(publicId: string): Promise<void>;
}
