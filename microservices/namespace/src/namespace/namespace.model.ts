import { NamespaceState } from "./namespace.state";

export default class NamespaceModel {
  id?: String;
  name: String;
  primaryColor: String;
  secoundColor: String;
  founder: String;
  authors: String[];
  state: NamespaceState;
}