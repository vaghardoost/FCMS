import { IsNotEmpty, IsString, Matches } from "class-validator";

export default class NamespaceSpecialDto {
  @Matches(/^[0-9a-fA-F]{24}$/, { message: 'namespace id is not valid as id pattern , check body data' })
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}