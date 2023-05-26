export interface NoteCreateDto {
  namespace: string;
  title: string;
  photo: string
  content: Array<any>;
  category?: string;
  tag?: string[];
  author: string;
}
