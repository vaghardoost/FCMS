import { IsOptional, IsString, Matches } from "class-validator";

export default class NamespaceThemeDto {
  @IsString()
  @IsOptional()
  @Matches(/^[0-9a-fA-F]{24}$/, { message: 'theme is not valid for id pattern' })
  public theme: string
}