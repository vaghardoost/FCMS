import { IsEnum, IsNotEmpty, IsString, Matches } from "class-validator";

export enum NamespaceState {
  Run = 'Run',
  Suspend = 'Suspend',
  Closed = 'Closed'
}

export default class NamespaceStateDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9a-fA-F]{24}$/, { message: 'author is not valid for id pattern' })
  public id: string;

  @IsEnum(NamespaceState)
  @IsNotEmpty()
  public state: NamespaceState;
}

