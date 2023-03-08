import { Test, TestingModule } from '@nestjs/testing';
import { LanguageType } from 'src/types';
import { SportController } from './sport.controller';
import { SportService } from './sport.service';

describe('SportController', () => {
    let controller: SportController;
    let sportService: SportService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SportController],
            providers: [
                {
                    provide: SportService,
                    useValue: {
                        findAll: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<SportController>(SportController);
        sportService = module.get<SportService>(SportService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAll', () => {
        it.each`
            lang
            ${'zh'}
            ${'en-gb'}
            ${'de'}
        `(
            'should call sportService.findAll with the correct paramete ($lang)',
            async ({ lang }: { lang: LanguageType }) => {
                await controller.findAll({ lang: lang });

                expect(sportService.findAll).toHaveBeenCalledWith(lang);
            },
        );

        it('should return the result of sportService.findAll', async () => {
            const expectedResult = ['sport1', 'sport2'];

            jest.spyOn(sportService, 'findAll').mockResolvedValueOnce(
                expectedResult,
            );

            const result = await controller.findAll({});

            expect(result).toEqual(expectedResult);
        });
    });
});
