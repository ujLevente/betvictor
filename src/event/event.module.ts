import { Module } from '@nestjs/common';
import { ApiCacheModule } from 'src/api-cache/api-cache.module';
import { EventController } from './event.controller';
import { EventService } from './event.service';

@Module({
    providers: [EventService],
    controllers: [EventController],
    imports: [ApiCacheModule],
})
export class EventModule {}
