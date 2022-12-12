import { Role } from '../admin.role';

export interface AdminCreateDto {
  username: string;
  password: string;
  role: Role;
}
