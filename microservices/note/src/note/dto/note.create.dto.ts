export interface NoteCreateDto {
  title: string;
  content: Array<string>;
  category?: string;
  tag?: string[];
  admin: number;
}
