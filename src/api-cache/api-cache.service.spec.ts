import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Cache } from 'cache-manager';
import { LanguageType } from 'src/types';
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
                        reset: jest.fn(),
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
            const key = service['CACHE_KEY_BASE'] + 'en-gb';

            jest.spyOn(cacheManager, 'get').mockImplementationOnce(() =>
                Promise.resolve(cachedData),
            );

            jest.spyOn(httpService.axiosRef, 'get');

            const result = await service.getData();

            expect(cacheManager.get).toBeCalledWith(key);
            expect(httpService.axiosRef.get).not.toBeCalled();
            expect(cacheManager.set).not.toBeCalled();
            expect(result).toEqual(cachedData);
        });

        it('should fetch data from the API and reset the cache if data not available in cache', async () => {
            const apiResponseData = { sports: ['sport3', 'sport4'] };
            const key = service['CACHE_KEY_BASE'] + 'en-gb';

            jest.spyOn(httpService.axiosRef, 'get').mockImplementationOnce(() =>
                Promise.resolve({ data: apiResponseData }),
            );

            const result = await service.getData();

            expect(result).toEqual(apiResponseData);
            expect(cacheManager.get).toBeCalledWith(key);
            expect(httpService.axiosRef.get).toBeCalledWith(
                `${service['API_URL_FIRST_PART']}en-gb${service['API_URL_SECOND_PART']}`,
            );
            expect(cacheManager.reset).toBeCalled();
            expect(cacheManager.set).toBeCalledWith(
                key,
                apiResponseData,
                service['CASH_EXPIRATION_IN_MS'],
            );
        });

        it('should fetch data from the API if not available in cache', async () => {
            const apiResponseData = { sports: ['sport3', 'sport4'] };
            const key = service['CACHE_KEY_BASE'] + 'en-gb';

            jest.spyOn(httpService.axiosRef, 'get').mockImplementationOnce(() =>
                Promise.resolve({ data: apiResponseData }),
            );

            const result = await service.getData();

            expect(result).toEqual(apiResponseData);
            expect(cacheManager.get).toBeCalledWith(key);
            expect(httpService.axiosRef.get).toBeCalledWith(
                `${service['API_URL_FIRST_PART']}en-gb${service['API_URL_SECOND_PART']}`,
            );
            expect(cacheManager.set).toBeCalledWith(
                key,
                apiResponseData,
                service['CASH_EXPIRATION_IN_MS'],
            );
        });

        it.each`
            lang
            ${'zh'}
            ${'en-gb'}
            ${'de'}
        `(
            'should send request to the api with the correct language parameter ($lang)',
            async ({ lang }: { lang: LanguageType }) => {
                const apiResponseData = { sports: ['sport3', 'sport4'] };

                jest.spyOn(httpService.axiosRef, 'get').mockImplementationOnce(
                    () => Promise.resolve(apiResponseData),
                );

                await service.getData(lang);

                expect(httpService.axiosRef.get).toBeCalledWith(
                    `${service['API_URL_FIRST_PART']}${lang}${service['API_URL_SECOND_PART']}`,
                );
            },
        );
    });
});
