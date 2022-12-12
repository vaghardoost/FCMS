import { IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Role } from "../../../module/auth/auth.role";

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  public username:string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  public password:string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Role)
  public role:Role;
}