import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateNoteDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    public title?:string;

    @IsArray()
    @IsOptional()
    public content?:Array<any>;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    public category?:string;

    @IsArray()
    @IsString({each:true})
    @IsOptional()
    public tag?:string[];
}
