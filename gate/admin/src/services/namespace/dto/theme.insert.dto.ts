import { IsArray, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { NamespaceType } from "../namespace.enum";

export default class InsertThemeDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsEnum(NamespaceType)
  @IsNotEmpty()
  public base: NamespaceType;

  @IsEnum(NamespaceType, { each: true })
  @IsArray()
  @IsNotEmpty()
  public include: NamespaceType[]
}
