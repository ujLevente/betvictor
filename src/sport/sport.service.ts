import { Injectable } from '@nestjs/common';
import { LanguageType } from 'src/types';
import { ApiCacheService } from '../api-cache/api-cache.service';

@Injectable()
export class SportService {
    constructor(private readonly apiCacheService: ApiCacheService) {}

    findAll(lang: LanguageType) {
        return this.apiCacheService.getData(lang);
    }
}
