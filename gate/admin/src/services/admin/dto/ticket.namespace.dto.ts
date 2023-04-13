import { IsNotEmpty, IsString, Matches } from "class-validator";

export default class TicketNamespaceDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9a-fA-F]{24}$/, { message: 'namespace id is not valid for id pattern' })
  public namespace: string;
}
