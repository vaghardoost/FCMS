import { IsArray, IsOptional, IsString } from "class-validator"

export default class DatapackUpdateDTO {
  @IsOptional()
  @IsString()
  public title: String

  @IsArray()
  @IsOptional()
  public content: Array<any>
  
  @IsOptional()
  env: any
}