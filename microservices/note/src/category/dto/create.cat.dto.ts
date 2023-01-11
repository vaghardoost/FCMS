export interface CreateCatDto {
  label: string;
  parent: string;
  admin: number;
  description: string;
  avatar?: string;
  color?: string;
}
