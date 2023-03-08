import { IsOptional, IsString } from 'class-validator';
import { LanguageType } from 'src/types';

export class FindAllSportsQueryDto {
    @IsString()
    @IsOptional()
    lang?: LanguageType;
}
