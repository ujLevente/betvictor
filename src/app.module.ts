import { Module } from '@nestjs/common';
import { SportModule } from './sport/sport.module';

@Module({
    imports: [SportModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
