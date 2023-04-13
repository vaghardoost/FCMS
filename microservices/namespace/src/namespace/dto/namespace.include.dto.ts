import { NamespaceType } from "src/namespace/namespace.enum"

export default interface NamespaceIncludeDto {
  id: string
  include: NamespaceType[]
}