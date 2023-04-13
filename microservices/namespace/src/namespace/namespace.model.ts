import { NamespaceType } from "src/namespace/namespace.enum";
import { NamespaceState } from "./namespace.state";

export default class NamespaceModel {
  id?: String;
  name: String;
  primaryColor: String;
  secoundColor: String;
  founder: String;
  authors: String[];
  include: NamespaceType[];
  state: NamespaceState;
  theme?: string;
}