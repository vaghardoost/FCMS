import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core"
import { Role } from "src/app.roles";

@Injectable()
export class AuthRoleGuard implements CanActivate{
  constructor(private readonly reflector:Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[]>('role',[context.getHandler()]);
    
    if(roles){
      const { user } = context.switchToHttp().getRequest();
      if (!user) {
        return false;
      }
      return roles.includes(user.role);
    }
    return true;
  }

}