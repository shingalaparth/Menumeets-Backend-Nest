import { Controller, Get, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { NotificationService } from '../application/notification.service';
import { UniversalAuthGuard } from '../../../shared/guards/universal-auth.guard'; // Assuming we have a guard that works for both

@Controller('notifications')
@UseGuards(UniversalAuthGuard)
export class NotificationController {
    constructor(private readonly service: NotificationService) { }

    @Get()
    async getMyNotifications(@Request() req: any) {
        if (req.user) {
            return this.service.getUserNotifications(req.user.sub);
        } else if (req.vendor) {
            return this.service.getVendorNotifications(req.vendor.sub || req.vendor.id);
        }
        return [];
    }

    @Patch(':id/read')
    async markAsRead(@Param('id') id: string) {
        return this.service.markAsRead(id);
    }
}
