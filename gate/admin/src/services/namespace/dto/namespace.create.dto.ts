import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { NamespaceType } from "../namespace.enum";

export default class NamespaceCreateDto {
  @IsString()
  @IsNotEmpty()
  admin: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsEnum(NamespaceType)
  @IsOptional()
  public include: string

}