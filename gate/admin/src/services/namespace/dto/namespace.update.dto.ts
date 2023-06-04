import { IsOptional, IsString, Matches } from "class-validator"

export default class NamespaceUpdateDto {
  @IsString()
  @IsOptional()
  public name: string

  @IsOptional()
  @IsString()
  public primaryColor: string

  @IsOptional()
  @IsString()
  public secoundColor: string

  @Matches(/^[0-9a-fA-F]{24}$/, { message: 'admin id is not valid for id pattern' })
  @IsOptional()
  public datapack: string

  
}
