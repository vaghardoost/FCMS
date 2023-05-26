import { IsArray, IsNotEmpty } from "class-validator";

export default class DatapackCreateDTO {

  @IsArray()
  @IsNotEmpty()
  public content: Array<any>

  @IsArray()
  @IsNotEmpty()
  public bottomsheet: Array<any>

}