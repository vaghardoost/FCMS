export interface NoteUpdateDto {
  id: string;
  photo?: string;
  title?: string;
  content?: Array<string>;
  category?: string;
  tag?: string[];
}
