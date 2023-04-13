import { IsNotEmpty, IsString, Matches, maxLength } from "class-validator";

export default class TicketOpenDto {
  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9a-fA-F]{24}$/, { message: 'namespace id is not valid for id pattern' })
  public namespace: string;

  @IsString()
  @IsNotEmpty()
  public content: string;
}
