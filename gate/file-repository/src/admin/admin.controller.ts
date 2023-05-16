import { Body, Controller, Get, Param, Post, SetMetadata, UseGuards, ValidationPipe } from "@nestjs/common";
import AdminService from "./admin.service";
import { AuthGuard } from "src/auth/auth.guard";
import { Role } from "src/app.roles";
import CreateNamespaceDTO from "./dto/admin.create.dto";
import { NamespaceGuard } from "src/guard/namespace.guard";

@Controller('admin')
export default class AdminController {

  constructor(private readonly service: AdminService) { }

  @Post('namespace')
  @UseGuards(AuthGuard,NamespaceGuard)
  @SetMetadata('role', [Role.Operator, Role.Manager])
  createNamespace(@Body(ValidationPipe) { namespace }: CreateNamespaceDTO) {
    return this.service.createNamespace(namespace);
  }

  @Get(':namespace')
  @UseGuards(AuthGuard,NamespaceGuard)
  @SetMetadata('role',[Role.Admin,Role.Author])
  metadata(@Param('namespace') namespace:string){
    return this.service.metadata(namespace)
  }
}