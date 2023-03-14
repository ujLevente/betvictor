import { CACHE_MANAGER, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Cache } from 'cache-manager';
import { ApiCacheService } from '../api-cache/api-cache.service';
import { EventService } from './event.service';

const MOCK_DATA = {
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
            const expectedResult = [
                { id: 1, name: 'Event 1' },
                { id: 2, name: 'Event 2' },
                { id: 3, name: 'Event 3' },
                { id: 4, name: 'Event 4' },
            ];

            jest.spyOn(apiCacheService, 'getData').mockResolvedValue(MOCK_DATA);
            jest.spyOn(cacheManager, 'get').mockResolvedValue(null);

            const result = await eventService.findAll('sports/events');

            expect(result).toEqual(expectedResult);
            expect(cacheManager.set).toHaveBeenCalledWith(
                'sports/events',
                expectedResult,
            );
        });
    });

    describe('findEventsBySportId', () => {
        it('should return cached events if available', async () => {
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
            const mockSportId = 200;
            const mockUri = '/sports/200/events';

            jest.spyOn(apiCacheService, 'getData').mockResolvedValueOnce(
                MOCK_DATA,
            );

            expect(
                eventService.findEventsBySportId(mockSportId, mockUri),
            ).rejects.toThrowError(NotFoundException);
            expect(cacheManager.set).not.toBeCalled();
        });

        it('should return events and cache them if not cached', async () => {
            const mockSportId = 123;
            const mockUri = '/sports/123/events';
            const expectedResult = [
                { id: 1, name: 'Event 1' },
                { id: 2, name: 'Event 2' },
            ];

            jest.spyOn(apiCacheService, 'getData').mockResolvedValueOnce(
                MOCK_DATA,
            );
            jest.spyOn(cacheManager, 'set').mockResolvedValueOnce(undefined);

            const result = await eventService.findEventsBySportId(
                mockSportId,
                mockUri,
            );

            expect(result).toEqual(expectedResult);
            expect(apiCacheService.getData).toBeCalled();
            expect(cacheManager.get).toBeCalledWith(mockUri);
            expect(cacheManager.set).toBeCalledWith(mockUri, expectedResult);
        });
    });

    describe('findEvent', () => {
        it('should return cached event if available', async () => {
            const mockSportId = 123;
            const mockEventId = 1;
            const mockUri = '/sports/123/events/1';
            const mockEvents = { id: 1, name: 'Event 1' };

            jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(mockEvents);

            const result = await eventService.findEvent(
                mockSportId,
                mockEventId,
                mockUri,
            );

            expect(result).toEqual(mockEvents);
            expect(cacheManager.get).toBeCalledWith(mockUri);
        });

        it('should throw NotFoundException if given an invalid sportId', async () => {
            const mockSportId = 200;
            const mockEventId = 1;
            const mockUri = '/sports/200/events/1';

            jest.spyOn(apiCacheService, 'getData').mockResolvedValueOnce(
                MOCK_DATA,
            );

            expect(
                eventService.findEvent(mockSportId, mockEventId, mockUri),
            ).rejects.toThrowError(NotFoundException);
            expect(cacheManager.set).not.toBeCalled();
        });

        it('should throw NotFoundException if given an invalid eventId', async () => {
            const mockSportId = 123;
            const mockEventId = 11;
            const mockUri = '/sports/123/events/11';

            jest.spyOn(apiCacheService, 'getData').mockResolvedValueOnce(
                MOCK_DATA,
            );

            expect(
                eventService.findEvent(mockSportId, mockEventId, mockUri),
            ).rejects.toThrowError(NotFoundException);
            expect(cacheManager.set).not.toBeCalled();
        });

        it('should return event and cache it if not cached', async () => {
            const mockSportId = 123;
            const mockEventId = 1;
            const mockUri = '/sports/123/events/1';
            const expectedResult = { id: 1, name: 'Event 1' };

            jest.spyOn(apiCacheService, 'getData').mockResolvedValueOnce(
                MOCK_DATA,
            );
            jest.spyOn(cacheManager, 'set').mockResolvedValueOnce(undefined);

            const result = await eventService.findEvent(
                mockSportId,
                mockEventId,
                mockUri,
            );

            expect(result).toEqual(expectedResult);
            expect(apiCacheService.getData).toBeCalled();
            expect(cacheManager.get).toBeCalledWith(mockUri);
            expect(cacheManager.set).toBeCalledWith(mockUri, expectedResult);
        });
    });
});
