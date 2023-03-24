import { IsString, IsNotEmpty } from "class-validator"

export class AdminAuthDto {
  @IsString()
  @IsNotEmpty()
  public username: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}
