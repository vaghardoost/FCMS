import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export default class DatapackCreateDTO {

  @IsNotEmpty()
  @IsString()
  public title: String

  @IsArray()
  @IsNotEmpty()
  public content: Array<any>

  @IsOptional()
  env: any
}

