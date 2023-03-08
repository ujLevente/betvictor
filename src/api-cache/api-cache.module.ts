import { HttpModule } from '@nestjs/axios';
import { CacheModule, Module } from '@nestjs/common';
import { ApiCacheService } from './api-cache.service';

@Module({
    imports: [CacheModule.register(), HttpModule],
    providers: [ApiCacheService],
})
export class ApiCacheModule {}
