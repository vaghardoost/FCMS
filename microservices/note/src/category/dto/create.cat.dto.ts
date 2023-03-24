export interface CreateCatDto {
  label: string;
  parent: string;
  author: string;
  description: string;
  avatar?: string;
  color?: string;
}
