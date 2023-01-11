import { NoteModel } from '../note/note.model';

export interface CategoryModel {
  id: string;
  label: string;
  admin: number;
  parent?: string;
  avatar?: string;
  color?: string;
  description: string;
  notes?: NoteModel[];
}
