import { IsString, IsNotEmpty } from "class-validator"

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  public username: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}
