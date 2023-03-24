import { IsNotEmpty, IsString } from "class-validator";

export default class NamespaceCreateDto {
  // admin of namespace
  @IsString()
  @IsNotEmpty()
  admin: string;

  // name of namespace
  @IsString()
  @IsNotEmpty()
  name: string;
}