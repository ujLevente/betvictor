import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { EventController } from './event.controller';
import { EventService } from './event.service';

describe('EventController', () => {
    let controller: EventController;
    let eventService: EventService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EventController],
            providers: [EventService],
        }).compile();

        controller = module.get<EventController>(EventController);
        eventService = module.get<EventService>(EventService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAll', () => {
        it('should call eventService.findAll with request.url', async () => {
            const request: Partial<Request> = {
                url: '/sports/events',
            };
            const expected = ['event1', 'event2'];

            jest.spyOn(eventService, 'findAll').mockResolvedValue(expected);

            const result = await controller.findAll(request as any);

            expect(eventService.findAll).toHaveBeenCalledWith(request.url);
            expect(result).toEqual(expected);
        });
    });

    describe('findAllBySportId', () => {
        it('should call eventService.findEventsBySportId with sportId and request.url', async () => {
            const request: Partial<Request> = {
                url: '/sports/1/events',
            };
            const sportId = 1;
            const expected = ['event1', 'event2'];

            jest.spyOn(eventService, 'findEventsBySportId').mockResolvedValue(
                expected,
            );

            const result = await controller.findAllBySportId(
                sportId,
                request as any,
            );

            expect(eventService.findEventsBySportId).toHaveBeenCalledWith(
                sportId,
                request.url,
            );
            expect(result).toEqual(expected);
        });
    });

    describe('findOne', () => {
        it('should call eventService.findEvent with sportId, eventId, and request.url', async () => {
            const request: Partial<Request> = {
                url: '/sports/1/events/1',
            };
            const sportId = 1;
            const eventId = 1;
            const expected = 'event1';

            jest.spyOn(eventService, 'findEvent').mockResolvedValue(expected);

            const result = await controller.findOne(
                sportId,
                eventId,
                request as any,
            );

            expect(eventService.findEvent).toHaveBeenCalledWith(
                sportId,
                eventId,
                request.url,
            );
            expect(result).toEqual(expected);
        });
    });
});
