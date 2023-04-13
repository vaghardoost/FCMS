import { NoteModel } from '../note/note.model';

export interface CategoryModel {
  _id?: string;
  id?: string;
  label: string;
  author: string;
  parent?: string;
  avatar?: string;
  color?: string;
  description: string;
  notes?: NoteModel[];
  namespace: string;
}
