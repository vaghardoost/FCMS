export interface NoteUpdateDto {
  id: string;
  namespace: string;
  photo?: string;
  title?: string;
  content?: Array<string>;
  category?: string;
  tag?: string[];
}
