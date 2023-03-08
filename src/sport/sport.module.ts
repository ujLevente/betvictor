import { Module } from '@nestjs/common';
import { ApiCacheModule } from 'src/api-cache/api-cache.module';
import { SportController } from './sport.controller';
import { SportService } from './sport.service';

@Module({
    controllers: [SportController],
    providers: [SportService],
    imports: [ApiCacheModule],
})
export class SportModule {}
