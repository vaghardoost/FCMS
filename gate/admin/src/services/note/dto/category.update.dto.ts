import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateCatDto {
    @IsString()
    @IsOptional()
    public label: string;

    @IsString()
    @IsOptional()
    public parent: string

    @IsString()
    @IsOptional()
    public description: string;

    @IsString()
    @IsOptional()
    public color?: string;

    @IsString()
    @IsOptional()
    public avarat?: string;
}