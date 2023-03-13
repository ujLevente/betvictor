import { Injectable } from '@nestjs/common';
import { ApiCacheService } from 'src/api-cache/api-cache.service';

@Injectable()
export class EventService {
    constructor(private readonly apiCacheService: ApiCacheService) {}

    async findAll() {
        const data = await this.apiCacheService.getData();
        const events = [];

        data.result.sports.forEach((sport) => {
            const competitions = sport.comp;
            return competitions.forEach((competition) =>
                events.push(...competition.events),
            );
        }, []);

        return events;
    }
}
