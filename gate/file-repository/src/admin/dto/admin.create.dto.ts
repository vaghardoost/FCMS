import { IsNotEmpty, Matches } from "class-validator";

export default class CreateNamespaceDTO {
  @Matches(/^[0-9a-fA-F]{24}$/, { message: 'admin id is not valid for id pattern' })
  @IsNotEmpty()
  namespace: string;
}