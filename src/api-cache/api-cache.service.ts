import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class ApiCacheService {
    private readonly CACHE_KEY_BASE = 'sports';
    private readonly API_URL =
        'https://partners.betvictor.mobi/en-gb/in-play/1/events';

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private httpService: HttpService,
    ) {}

    async getData(language: 'en-gb' | 'de' | 'zh' = 'en-gb'): Promise<any> {
        const key = this.CACHE_KEY_BASE + language;
        const cachedData = await this.cacheManager.get(key);

        if (cachedData) {
            return cachedData;
        }

        const apiResponse = await this.httpService.axiosRef.get(this.API_URL);
        await this.cacheManager.set(key, apiResponse.data);

        return apiResponse.data;
    }
}
