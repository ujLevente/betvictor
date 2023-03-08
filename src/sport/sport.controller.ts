import { Controller, Get, Query } from '@nestjs/common';
import { FindAllSportsQueryDto } from './dto/find-all-sports-query.dto';
import { SportService } from './sport.service';

@Controller('sports')
export class SportController {
    constructor(private readonly sportService: SportService) {}

    @Get()
    findAll(@Query() { lang }: FindAllSportsQueryDto) {
        return this.sportService.findAll(lang);
    }
}
