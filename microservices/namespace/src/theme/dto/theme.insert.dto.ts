import { NamespaceType } from "../../namespace/namespace.enum";

export default interface ThemeInsertDto {
  name: string;
  base: NamespaceType;
  include: NamespaceType[];
}