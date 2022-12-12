import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateNoteDto {
    @IsString()
    @IsNotEmpty()
    public title:string;

    @IsArray()
    @IsNotEmpty()
    public content:Array<any>;

    @IsString()
    @IsNotEmpty()
    public category:string;

    @IsArray()
    @IsString({each:true})
    @IsOptional()
    public tag?:string[];
}
