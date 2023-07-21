import { NamespaceType } from "src/namespace/namespace.enum";

export default interface NamespaceCreateDto {
  operator: string;
  admin: string;
  description: string;
  name: string;
  datapack: string;
  base: NamespaceType;
  avatar: string;
  include: NamespaceType[];
}
