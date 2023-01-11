export interface NoteUpdateDto {
  id: string;
  title?: string;
  content?: Array<string>;
  category?: string;
  tag?: string[];
}
