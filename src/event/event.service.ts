import {
    CACHE_MANAGER,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ApiCacheService } from 'src/api-cache/api-cache.service';

@Injectable()
export class EventService {
    constructor(
        private readonly apiCacheService: ApiCacheService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    async findAll(uri: string) {
        const cachedEvents = await this.cacheManager.get(uri);

        if (cachedEvents) {
            return cachedEvents;
        }

        const data = await this.apiCacheService.getData();

        const events = [];

        data.result.sports.forEach((sport) => {
            const competitions = sport.comp;
            return competitions.forEach((competition) =>
                events.push(...competition.events),
            );
        }, []);

        this.cacheManager.set(uri, events);

        return events;
    }

    async findBySportId(sportId: number, uri: string) {
        const cachedEvents = await this.cacheManager.get(uri);

        if (cachedEvents) {
            return cachedEvents;
        }

        const data = await this.apiCacheService.getData();

        const sport = data.result.sports.find((sport) => sport.id === sportId);

        if (!sport) {
            throw new NotFoundException('invalid sport id');
        }

        const events = sport.comp.flatMap((competition) => competition.events);

        this.cacheManager.set(uri, events);

        return events;
    }

    async findEvent(sportId: number, eventId: number, uri: string) {
        const cachedEvents = await this.cacheManager.get(uri);

        if (cachedEvents) {
            return cachedEvents;
        }

        const data = await this.apiCacheService.getData();
        const sport = data.result.sports.find((sport) => sport.id === sportId);

        if (!sport) {
            throw new NotFoundException('invalid sport id');
        }

        let result;

        sport.comp.forEach((competition) => {
            const event = competition.events.find(
                (event) => event.id === eventId,
            );

            if (event) {
                result = event;
                return;
            }
        });

        if (!result) {
            throw new NotFoundException('invalid event id');
        }

        this.cacheManager.set(uri, result);

        return result;
    }
}
