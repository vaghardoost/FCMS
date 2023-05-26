import { IsNotEmpty, IsString, Matches } from "class-validator";

export default class DatapackDeleteDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9a-fA-F]{24}$/, { message: 'datapack id is not valid for id pattern' })
  public id: string;

}