import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateNoteDto {
    @IsString()
    @IsOptional()
    public title: string;

    @IsString()
    @IsOptional()
    public photo: string;

    @IsArray()
    @IsOptional()
    public content: Array<any>;

    @IsString()
    @IsOptional()
    public category?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    public tag?: string[];
}
