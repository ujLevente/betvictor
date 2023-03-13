import { Test, TestingModule } from '@nestjs/testing';
import { LanguageType } from 'src/types';
import { ApiCacheService } from '../api-cache/api-cache.service';
import { SportService } from './sport.service';

describe('SportService', () => {
    let service: SportService;
    let apiCacheService: ApiCacheService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SportService,
                {
                    provide: ApiCacheService,
                    useValue: {
                        getData: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<SportService>(SportService);
        apiCacheService = module.get<ApiCacheService>(ApiCacheService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        const lang = 'zh';
        const expectedResult = { result: { sports: ['sport1', 'sport2'] } };

        beforeEach(() => {
            jest.spyOn(apiCacheService, 'getData').mockResolvedValueOnce(
                expectedResult,
            );
        });

        it.each`
            lang
            ${'zh'}
            ${'en-gb'}
            ${'de'}
        `(
            'should call apiCacheService.getData with the correct language parameter ($lang)',
            async ({ lang }: { lang: LanguageType }) => {
                await service.findAll(lang);

                expect(apiCacheService.getData).toHaveBeenCalledWith(lang);
            },
        );

        it('should return the data returned by apiCacheService.getData', async () => {
            const mockData = { result: { sports: ['sport1', 'sport2'] } };

            jest.spyOn(apiCacheService, 'getData').mockResolvedValueOnce(
                mockData,
            );

            const result = await service.findAll(lang);

            expect(result).toEqual(mockData.result.sports);
        });
    });
});
