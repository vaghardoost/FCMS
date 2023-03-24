import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCatDto {
    @IsString()
    @IsNotEmpty()
    public label:string;

    @IsString()
    @IsOptional()
    public parent:string

    @IsString()
    @IsNotEmpty()
    public description:string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    public color?:string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    public avatar?:string;
}