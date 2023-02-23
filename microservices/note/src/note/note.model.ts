export interface NoteModel {
  id: string;
  title: string;
  photo: string;
  content?: Array<any>;
  tag: Array<string>;
  createAt: string;
  category?: string;
  admin: number;
}
