import { Controller, OnModuleInit, Put, Inject, Get, UseGuards, SetMetadata, Request, Post, Body, ValidationPipe, Param } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { Role } from "src/app.roles";
import { AuthGuard } from "src/auth/auth.guard";
import { NamespaceGuard } from "./guards/namespace.guard";
import { ValidationPipeId } from "../services.pipe";
import NamespaceAuthorDto from "./dto/namespace.author.dto";
import NamespaceCreateDto from "./dto/namespace.create.dto";
import NamespaceStateDto from "./dto/namespace.state.dto";
import NamespaceUpdateDto from "./dto/namespace.update.dto";
import NamespaceIncludeDto from "./dto/namespace.include.dto";
import NamespaceThemeDto from "./dto/namespace.theme.dto";
import NamespaceSpecialDto from "./dto/namespace.special.dtor";

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
    this.client.subscribeToResponseOf("namespace.get.own");
    this.client.subscribeToResponseOf("namespace.all");
    this.client.subscribeToResponseOf("namespace.include");
    this.client.subscribeToResponseOf("namespace.theme");
    this.client.subscribeToResponseOf("namespace.get.special");
    this.client.subscribeToResponseOf("namespace.set.special");
    this.client.subscribeToResponseOf("namespace.get");
  }

  @Get()
  @UseGuards(AuthGuard)
  @SetMetadata("role", [Role.Admin, Role.Author])
  public getAuthorNamespace(@Request() req: any) {
    return this.client.send("namespace.get.own", { id: req.user.id })
  }

  @Put()
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

  @Post("include")
  @UseGuards(AuthGuard)
  @SetMetadata("role", [Role.Manager, Role.Operator])
  public include(@Body(ValidationPipe) dto: NamespaceIncludeDto) {
    return this.client.send("namespace.include", dto)
  }


  @Post("reload")
  @UseGuards(AuthGuard)
  @SetMetadata("role", [Role.Manager, Role.Operator])
  public reloadNamespace() {
    return this.client.send("namespace.reload", {})
  }

  @Get("list")
  @UseGuards(AuthGuard)
  @SetMetadata("role", [Role.Manager, Role.Operator])
  public list() {
    return this.client.send("namespace.all", {})
  }

  @Post("special")
  @UseGuards(AuthGuard)
  @SetMetadata("role", [Role.Manager])
  public setSpecial(@Body(ValidationPipe) dto: NamespaceSpecialDto) {
    return this.client.send("namespace.set.special", { ...dto });
  }

  @Get("special/:name")
  public getSpecial(@Param('name') name: String) {
    return this.client.send("namespace.get.special", { name: name });
  }

  @Get(":id")
  public getNamespace(@Param('id') id: String){
    return this.client.send("namespace.get", { id: id });
  }

  @Post(":id")
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

  @Post(":id/theme")
  @UseGuards(AuthGuard)
  @SetMetadata("role", [Role.Operator, Role.Manager])
  public setTheme(@Body(ValidationPipe) dto: NamespaceThemeDto, @Param("id", ValidationPipeId) id: string) {
    return this.client.send("namespace.theme", { ...dto, id: id });
  }

}