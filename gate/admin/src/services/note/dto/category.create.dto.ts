import { Matches, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCatDto {
    @IsString()
    @IsNotEmpty()
    public label: string;

    @IsString()
    @Matches(/^[0-9a-fA-F]{24}$/, { message: 'category id is not valid for id pattern' })
    @IsOptional()
    public parent: string

    @IsString()
    @IsNotEmpty()
    public description: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    public color?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    public avatar?: string;
}