import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class ApiCacheService {
    private readonly CACHE_KEY = 'sports';
    private readonly API_URL =
        'https://partners.betvictor.mobi/en-gb/in-play/1/events';

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private httpService: HttpService,
    ) {}

    async getData(): Promise<any> {
        const cachedData = await this.cacheManager.get(this.CACHE_KEY);

        if (cachedData) {
            return cachedData;
        }

        const apiResponse = await this.httpService.axiosRef.get(this.API_URL);
        await this.cacheManager.set(this.CACHE_KEY, apiResponse.data);

        return apiResponse.data;
    }
}
