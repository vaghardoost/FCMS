import { IsNotEmpty, IsString, Matches } from "class-validator";

export default class TicketPushDto {
  @IsString()
  @IsNotEmpty()
  public content: string;
}
