import { Injectable } from '@nestjs/common';
import { LanguageType } from 'src/types';
import { ApiCacheService } from '../api-cache/api-cache.service';

@Injectable()
export class SportService {
    constructor(private readonly apiCacheService: ApiCacheService) {}

    async findAll(lang: LanguageType) {
        const data = await this.apiCacheService.getData(lang);
        return data.result.sports;
    }
}
