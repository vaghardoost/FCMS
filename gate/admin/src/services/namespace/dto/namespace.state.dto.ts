import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export enum NamespaceState {
  Run = 'Run',
  Suspend = 'Suspend',
  Closed = 'Closed'
}

export default class NamespaceStateDto {
  @IsString()
  @IsNotEmpty()
  public id: string;

  @IsEnum(NamespaceState)
  @IsNotEmpty()
  public state: NamespaceState;
}

