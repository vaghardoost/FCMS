import { IsString, IsNotEmpty } from "class-validator"

export class AdminDto {
  @IsString()
  @IsNotEmpty()
  public username: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}
