export interface CreateCatDto {
  namespace: string;
  label: string;
  parent: string;
  author: string;
  description: string;
  avatar?: string;
  color?: string;
}
