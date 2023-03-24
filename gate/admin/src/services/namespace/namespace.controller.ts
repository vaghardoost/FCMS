import { Controller, OnModuleInit, Inject,Get,UseGuards,SetMetadata, Request, Post, Body, ValidationPipe, Patch, Param } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { Role } from "src/app.roles";
import { AuthGuard } from "src/auth/auth.guard";
import NamespaceAuthorDto from "./dto/namespace.author.dto";
import NamespaceCreateDto from "./dto/namespace.create.dto";
import NamespaceStateDto from "./dto/namespace.state.dto";
import NamespaceUpdateDto from "./dto/namespace.update.dto";
import { NamespaceGuard } from "./namespace.guard";

@Controller('namespace')
export default class NamespaceController implements OnModuleInit {

  constructor(@Inject("kafka-client") private readonly client: ClientKafka) { }

  onModuleInit() {
    this.client.subscribeToResponseOf("namespace.create");
    this.client.subscribeToResponseOf("namespace.state");
    this.client.subscribeToResponseOf("namespace.reload");
    this.client.subscribeToResponseOf("namespace.update");
    this.client.subscribeToResponseOf("namespace.push");
    this.client.subscribeToResponseOf("namespace.pull");
    this.client.subscribeToResponseOf("namespace.get");
  }

  @Get()
  @UseGuards(AuthGuard)
  @SetMetadata("role", [Role.Admin, Role.Author])
  public getAuthorNamespace(@Request() req: any) {
    return this.client.send("namespace.get", { id: req.user.id })
  }

  @Post()
  @UseGuards(AuthGuard)
  @SetMetadata("role", [Role.Manager, Role.Operator])
  public createNamespace(@Body(ValidationPipe) dto: NamespaceCreateDto, @Request() req: any) {
    return this.client.send("namespace.create", { ...dto, operator: req.user.id });
  }

  @Post("state")
  @UseGuards(AuthGuard)
  @SetMetadata("role", [Role.Manager, Role.Operator])
  public state(@Body(ValidationPipe) dto: NamespaceStateDto) {
    return this.client.send("namespace.state", dto)
  }

  @Patch("reload")
  @UseGuards(AuthGuard)
  @SetMetadata("role", [Role.Manager, Role.Operator])
  public reloadNamespace() {
    return this.client.send("namespace.reload", {})
  }

  @Patch(":id")
  @UseGuards(AuthGuard, NamespaceGuard)
  @SetMetadata("role", [Role.Admin])
  public updateNamespace(@Param("id") id: string, @Body(ValidationPipe) dto: NamespaceUpdateDto) {
    return this.client.send("namespace.update", { ...dto, id: id });
  }

  @Post(":id/pull")
  @UseGuards(AuthGuard, NamespaceGuard)
  @SetMetadata("role", [Role.Admin])
  public pullAuthor(@Body(ValidationPipe) dto: NamespaceAuthorDto, @Param("id") id: string) {
    return this.client.send("namespace.pull", { ...dto, id: id });
  }

  @Post(":id/push")
  @UseGuards(AuthGuard, NamespaceGuard)
  @SetMetadata("role", [Role.Admin])
  public pushAuthor(@Body(ValidationPipe) dto: NamespaceAuthorDto, @Param("id") id: string) {
    return this.client.send("namespace.push", { ...dto, id: id });
  }
}