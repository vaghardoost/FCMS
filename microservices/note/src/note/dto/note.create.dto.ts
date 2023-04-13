export interface NoteCreateDto {
  namespace: string;
  title: string;
  photo: string
  content: Array<string>;
  category?: string;
  tag?: string[];
  author: string;
}
