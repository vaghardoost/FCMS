import { IsArray, IsEnum, IsNotEmpty, IsString, Matches } from "class-validator";
import { NamespaceType } from "../namespace.enum";

export default class NamespaceIncludeDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9a-fA-F]{24}$/, { message: 'author is not valid for id pattern' })
  public id:string;

  @IsArray()
  @IsEnum(NamespaceType, { each: true })
  @IsNotEmpty()
  public include: string
}