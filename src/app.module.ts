import { CacheModule, Module } from '@nestjs/common';
import { EventModule } from './event/event.module';
import { SportModule } from './sport/sport.module';

@Module({
    imports: [
        CacheModule.register({ ttl: 0, isGlobal: true }),
        SportModule,
        EventModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
