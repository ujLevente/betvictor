import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ApiCacheService } from './api-cache.service';

@Module({
    imports: [HttpModule],
    providers: [ApiCacheService],
    exports: [ApiCacheService],
})
export class ApiCacheModule {}
