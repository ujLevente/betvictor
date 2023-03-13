import {
    Controller,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
} from '@nestjs/common';
import { EventService } from './event.service';

@Controller()
export class EventController {
    constructor(private readonly eventService: EventService) {}

    @Get('sports/events')
    findAll() {
        return this.eventService.findAll();
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
    ) {
        return this.eventService.findAll();
    }

    @Get('sports/:sportId/events/:event')
    findOne(
        @Param(
            'sportId',
            new ParseIntPipe({
                errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
            }),
        )
        sportId: number,
        @Param(
            'sportId',
            new ParseIntPipe({
                errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
            }),
        )
        eventId: number,
    ) {
        return this.eventService.findAll();
    }
}
