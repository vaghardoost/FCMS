import { IsString, IsNotEmpty, Matches } from "class-validator";

export default class NamespaceAuthorDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9a-fA-F]{24}$/, { message: 'author is not valid for id pattern' })
  public author: string;

}
