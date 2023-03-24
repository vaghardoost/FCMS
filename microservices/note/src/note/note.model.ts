export interface NoteModel {
  _id?: string;
  id?: string;
  title: string;
  photo: string;
  content?: Array<any>;
  tag: Array<string>;
  category?: string;
  admin: number;
}
