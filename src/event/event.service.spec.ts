import { CACHE_MANAGER, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Cache } from 'cache-manager';
import { ApiCacheService } from '../api-cache/api-cache.service';
import { EventService } from './event.service';

describe('EventService', () => {
    let eventService: EventService;
    let apiCacheService: ApiCacheService;
    let cacheManager: Cache;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventService,
                {
                    provide: ApiCacheService,
                    useValue: {
                        getData: jest.fn(),
                    },
                },
                {
                    provide: CACHE_MANAGER,
                    useValue: {
                        get: jest.fn(),
                        set: jest.fn(),
                    },
                },
            ],
        }).compile();

        eventService = module.get<EventService>(EventService);
        apiCacheService = module.get<ApiCacheService>(ApiCacheService);
        cacheManager = module.get<Cache>(CACHE_MANAGER);
    });

    it('should be defined', () => {
        expect(eventService).toBeDefined();
    });

    describe('findAll', () => {
        it('should return cached events if available', async () => {
            const cachedEvents = [{ id: 1, name: 'event 1' }];
            jest.spyOn(cacheManager, 'get').mockResolvedValue(cachedEvents);

            const result = await eventService.findAll('sports/events');

            expect(result).toEqual(cachedEvents);
            expect(cacheManager.get).toHaveBeenCalledWith('sports/events');
        });

        it('should return all events and cache them', async () => {
            const data = {
                result: {
                    sports: [
                        {
                            id: 1,
                            name: 'sport 1',
                            comp: [
                                {
                                    id: 1,
                                    name: 'competition 1',
                                    events: [
                                        { id: 1, name: 'event 1' },
                                        { id: 2, name: 'event 2' },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            };
            jest.spyOn(apiCacheService, 'getData').mockResolvedValue(data);
            jest.spyOn(cacheManager, 'get').mockResolvedValue(null);

            const result = await eventService.findAll('sports/events');

            expect(result).toEqual([
                { id: 1, name: 'event 1' },
                { id: 2, name: 'event 2' },
            ]);
            expect(cacheManager.set).toHaveBeenCalledWith('sports/events', [
                { id: 1, name: 'event 1' },
                { id: 2, name: 'event 2' },
            ]);
        });
    });

    describe('findEventsBySportId', () => {
        it('should return cached events if they exist', async () => {
            const mockSportId = 123;
            const mockUri = '/sports/123/events';
            const mockEvents = [
                { id: 1, name: 'Event 1' },
                { id: 2, name: 'Event 2' },
            ];

            jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(mockEvents);

            const result = await eventService.findEventsBySportId(
                mockSportId,
                mockUri,
            );

            expect(result).toEqual(mockEvents);
            expect(cacheManager.get).toBeCalledWith(mockUri);
        });

        it('should throw NotFoundException if given an invalid sportId', async () => {
            const mockSportId = 456;
            const mockUri = '/sports/456/events';
            const mockData = {
                result: {
                    sports: [{ id: 123, comp: [{ events: [] }] }],
                },
            };

            jest.spyOn(apiCacheService, 'getData').mockResolvedValueOnce(
                mockData,
            );

            expect(
                eventService.findEventsBySportId(mockSportId, mockUri),
            ).rejects.toThrowError(NotFoundException);
            expect(cacheManager.set).not.toBeCalled();
        });

        it('should return events and cache them if not cached', async () => {
            const mockSportId = 123;
            const mockUri = '/sports/123/events';
            const mockData = {
                result: {
                    sports: [
                        {
                            id: 123,
                            comp: [
                                { events: [{ id: 1, name: 'Event 1' }] },
                                { events: [{ id: 2, name: 'Event 2' }] },
                            ],
                        },
                        {
                            id: 456,
                            comp: [
                                { events: [{ id: 3, name: 'Event 3' }] },
                                { events: [{ id: 4, name: 'Event 4' }] },
                            ],
                        },
                    ],
                },
            };

            jest.spyOn(apiCacheService, 'getData').mockResolvedValueOnce(
                mockData,
            );
            jest.spyOn(cacheManager, 'set').mockResolvedValueOnce(undefined);

            const result = await eventService.findEventsBySportId(
                mockSportId,
                mockUri,
            );

            expect(result).toEqual([
                { id: 1, name: 'Event 1' },
                { id: 2, name: 'Event 2' },
            ]);
            expect(apiCacheService.getData).toBeCalled();
            expect(cacheManager.get).toBeCalledWith(mockUri);
            expect(cacheManager.set).toBeCalledWith(mockUri, [
                { id: 1, name: 'Event 1' },
                { id: 2, name: 'Event 2' },
            ]);
        });
    });
});
