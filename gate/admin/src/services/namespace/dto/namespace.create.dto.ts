import { Matches, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { NamespaceType } from "../namespace.enum";

export default class NamespaceCreateDto {
  @Matches(/^[0-9a-fA-F]{24}$/, { message: 'admin id is not valid for id pattern' })
  @IsNotEmpty()
  admin: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsArray()
  @IsEnum(NamespaceType)
  @IsOptional()
  public include: NamespaceType
  
  @Matches(/^[0-9a-fA-F]{24}$/, { message: 'admin id is not valid for id pattern' })
  @IsOptional()
  public datapack: string

}