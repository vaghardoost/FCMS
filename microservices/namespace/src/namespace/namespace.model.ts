import { NamespaceType } from "src/namespace/namespace.enum";
import { NamespaceState } from "./namespace.state";

export default class NamespaceModel {
  id?: String;
  name: String;
  description: String;
  primaryColor: String;
  secoundColor: String;
  founder: String;
  authors: String[];
  include: NamespaceType[];
  operator: string;
  state: NamespaceState;
  theme?: string;
  datapack?: string;
  avatar?: string;
}