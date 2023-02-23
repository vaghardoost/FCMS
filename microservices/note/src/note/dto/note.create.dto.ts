export interface NoteCreateDto {
  title: string;
  photo: string
  content: Array<string>;
  category?: string;
  tag?: string[];
  admin: number;
}
