import { IsOptional, IsString } from "class-validator"

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
  
}
