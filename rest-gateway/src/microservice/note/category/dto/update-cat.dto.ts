import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CreateCatDto } from "./create-cat.dto";

export class UpdateCatDto {
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    public label:string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    public parent:string
}