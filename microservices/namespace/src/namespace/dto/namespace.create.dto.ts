import { NamespaceType } from "src/namespace/namespace.enum";

export default interface NamespaceCreateDto {
  operator: string;
  admin: string;
  name: string;
  datapack: string;
  base: NamespaceType;
  include: NamespaceType[];
}
