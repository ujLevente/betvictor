import { Module } from '@nestjs/common';
import { EventModule } from './event/event.module';
import { SportModule } from './sport/sport.module';

@Module({
    imports: [SportModule, EventModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
