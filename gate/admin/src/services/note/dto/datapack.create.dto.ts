import { IsArray, IsNotEmpty, IsOptional } from "class-validator";

export default class DatapackCreateDTO {

  @IsArray()
  @IsNotEmpty()
  public content: Array<any>

  @IsOptional()
  env: any
}

