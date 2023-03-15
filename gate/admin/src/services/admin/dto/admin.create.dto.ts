import { IsString, IsNotEmpty, IsEnum } from "class-validator"
import { Role } from "../../../app.roles";

export class AdminCreateDto {
  @IsNotEmpty()
  @IsEnum(Role)
  public role: Role;

  @IsString()
  @IsNotEmpty()
  public username: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}
