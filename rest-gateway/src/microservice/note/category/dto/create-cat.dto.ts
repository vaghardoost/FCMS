import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCatDto {
    @IsString()
    @IsNotEmpty()
    public label:string;

    @IsString()
    @IsOptional()
    public parent:string
}