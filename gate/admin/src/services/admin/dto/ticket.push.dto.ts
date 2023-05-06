import { IsNotEmpty, IsString } from "class-validator";

export default class TicketPushDto {
  @IsString()
  @IsNotEmpty()
  public content: string;
}
