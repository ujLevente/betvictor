import {
    Controller,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
    Req,
} from '@nestjs/common';
import { EventService } from './event.service';

@Controller()
export class EventController {
    constructor(private readonly eventService: EventService) {}

    @Get('sports/events')
    findAll(@Req() request: Request) {
        return this.eventService.findAll(request.url);
    }

    @Get('sports/:sportId/events')
    findAllBySportId(
        @Param(
            'sportId',
            new ParseIntPipe({
                errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
            }),
        )
        sportId: number,
        @Req() request: Request,
    ) {
        return this.eventService.findBySportId(sportId, request.url);
    }

    @Get('sports/:sportId/events/:eventId')
    findOne(
        @Param(
            'sportId',
            new ParseIntPipe({
                errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
            }),
        )
        sportId: number,
        @Param(
            'eventId',
            new ParseIntPipe({
                errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
            }),
        )
        eventId: number,
        @Req() request: Request,
    ) {
        return this.eventService.findEvent(sportId, eventId, request.url);
    }
}
