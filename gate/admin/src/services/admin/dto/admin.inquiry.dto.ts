import { IsNotEmpty, IsString } from "class-validator";

export class AdminInquiryDto {
  @IsString()
  @IsNotEmpty()
  public username: string;
}