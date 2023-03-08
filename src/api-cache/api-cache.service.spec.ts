import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Cache } from 'cache-manager';
import { ApiCacheService } from './api-cache.service';

describe('ApiCacheService', () => {
    let service: ApiCacheService;
    let httpService: HttpService;
    let cacheManager: Cache;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ApiCacheService,
                {
                    provide: CACHE_MANAGER,
                    useValue: {
                        get: jest.fn(),
                        set: jest.fn(),
                    },
                },
                {
                    provide: HttpService,
                    useValue: {
                        axiosRef: { get: jest.fn() },
                    },
                },
            ],
        }).compile();

        service = module.get<ApiCacheService>(ApiCacheService);
        httpService = module.get<HttpService>(HttpService);
        cacheManager = module.get<Cache>(CACHE_MANAGER);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getData', () => {
        it('should return cached data if available', async () => {
            const cachedData = { sports: ['sport1', 'sport2'] };

            jest.spyOn(cacheManager, 'get').mockImplementationOnce(() =>
                Promise.resolve(cachedData),
            );

            jest.spyOn(httpService.axiosRef, 'get');

            const result = await service.getData();

            expect(cacheManager.get).toBeCalledWith('sportsen-gb');
            expect(httpService.axiosRef.get).not.toBeCalled();
            expect(cacheManager.set).not.toBeCalled();
            expect(result).toEqual(cachedData);
        });

        it('should fetch data from the API if not available in cache', async () => {
            const apiResponseData = { sports: ['sport3', 'sport4'] };

            jest.spyOn(httpService.axiosRef, 'get').mockImplementationOnce(() =>
                Promise.resolve({ data: apiResponseData }),
            );

            const result = await service.getData();

            expect(result).toEqual(apiResponseData);
            expect(cacheManager.get).toBeCalledWith('sportsen-gb');
            expect(httpService.axiosRef.get).toBeCalled();
            expect(cacheManager.set).toBeCalledWith(
                'sportsen-gb',
                apiResponseData,
            );
        });
    });
});
