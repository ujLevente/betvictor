import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { LanguageType } from 'src/types';

@Injectable()
export class ApiCacheService {
    private readonly CACHE_KEY_BASE = 'sports';
    private readonly API_URL =
        'https://partners.betvictor.mobi/en-gb/in-play/1/events';
    private readonly CASH_EXPIRATION_IN_MS = 600000;

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private httpService: HttpService,
    ) {}

    async getData(language: LanguageType = 'en-gb'): Promise<any> {
        const key = this.CACHE_KEY_BASE + language;
        const cachedData = await this.cacheManager.get(key);

        if (cachedData) {
            return cachedData;
        }

        // reset all cached keys if cached api data expired
        await this.cacheManager.reset();

        const apiResponse = await this.httpService.axiosRef.get(
            `https://partners.betvictor.mobi/${language}/in-play/1/events`,
        );

        await this.cacheManager.set(
            key,
            apiResponse.data,
            this.CASH_EXPIRATION_IN_MS,
        );

        return apiResponse.data;
    }
}
