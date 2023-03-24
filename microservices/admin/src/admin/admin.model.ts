import { Role } from './admin.role';

export class AdminModel {
  public _id?: any;
  public id?: string;
  public username: string;
  public password?: string;
  public role?: Role;
}
