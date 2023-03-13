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

    async findBySportId(sportId: number) {
        const data = await this.apiCacheService.getData();
        const sport = data.result.sports.find((sport) => sport.id === sportId);

        return sport.comp.flatMap((competition) => competition.events);
    }

    async findEvent(sportId: number, eventId: number) {
        const data = await this.apiCacheService.getData();
        const sport = data.result.sports.find((sport) => sport.id === sportId);

        let result;

        console.log(eventId);
        sport.comp.forEach((competition) => {
            const event = competition.events.find(
                (event) => event.id === eventId,
            );

            if (event) {
                result = event;
                return;
            }
        });

        return result;
    }
}
