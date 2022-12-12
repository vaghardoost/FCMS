import { Role } from './admin.role';

export class AdminModel {
  public id: number;
  public username: string;
  public password?: string;
  public role?: Role;
}
