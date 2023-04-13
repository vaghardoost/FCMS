import { NamespaceType } from "../namespace/namespace.enum";

export default interface ThemeModel {
  id?: string,
  name: string
  base: NamespaceType,
  include: NamespaceType[],
}