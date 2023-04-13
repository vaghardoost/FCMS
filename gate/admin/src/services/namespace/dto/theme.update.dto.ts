import { IsArray, IsEnum, IsOptional, IsString } from "class-validator";
import { NamespaceType } from "../namespace.enum";

export default class UpdateThemeDto {
  @IsString()
  @IsOptional()
  public name: string;

  @IsEnum(NamespaceType)
  @IsOptional()
  public base: NamespaceType;

  @IsEnum(NamespaceType, { each: true })
  @IsArray()
  @IsOptional()
  public include: NamespaceType[]
}