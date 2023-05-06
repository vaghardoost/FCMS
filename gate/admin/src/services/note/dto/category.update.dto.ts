import { Matches, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateCatDto {
    @IsString()
    @IsOptional()
    public label: string;

    @IsString()
    @IsOptional()
    @Matches(/^[0-9a-fA-F]{24}$/, { message: 'category id is not valid for id pattern' })
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