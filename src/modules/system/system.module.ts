import { Module } from '@nestjs/common';
import { SystemService } from './application/system.service';
import { SystemController } from './presentation/system.controller';

@Module({
    controllers: [SystemController],
    providers: [SystemService],
    exports: [SystemService],
})
export class SystemModule { }
