import { IsArray, IsOptional } from "class-validator"

export default class DatapackUpdateDTO {
  @IsArray()
  @IsOptional()
  public content: Array<any>
  
  @IsOptional()
  env: any
}