import { Body, Param, Request, Get, ValidationPipe, Put, Delete, Controller, Inject, Post, SetMetadata, UseGuards, OnModuleInit } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { Role } from "src/app.roles";
import { AuthGuard } from "src/auth/auth.guard";
import { QueryRequired } from "../services.param";
import { ValidationPipeId } from "../services.pipe";
import { UpdateCatDto } from "./dto/category.update.dto";
import { NamespaceGuard } from "../namespace/guards/namespace.guard";
import { CreateCatDto } from "./dto/category.create.dto";
import { DeleteCatDto } from "./dto/category.delete.dto";

@Controller('category')
export default class CategoryController implements OnModuleInit {

  constructor(@Inject("kafka-client") private readonly client: ClientKafka) { }

  onModuleInit() {
    this.client.subscribeToResponseOf("category.get");
    this.client.subscribeToResponseOf("category.reload");
    this.client.subscribeToResponseOf("category.list");
    this.client.subscribeToResponseOf("category.update");
    this.client.subscribeToResponseOf("category.create");
    this.client.subscribeToResponseOf("category.delete");
  }

  @Post("reload")
  @UseGuards(AuthGuard)
  @SetMetadata("role", [Role.Manager, Role.Operator])
  public async reload_category() {
    return this.client.send("category.reload", {});
  }

  @Post(":namespace/:id")
  @UseGuards(AuthGuard)
  @SetMetadata("role", [Role.Author, Role.Admin])
  public async update_category(
    @Param('namespace', ValidationPipeId) namespace: string,
    @Param('id', ValidationPipeId) id: string,
    @Body(ValidationPipe) dto: UpdateCatDto) {
    return this.client.send("category.update", { ...dto, id: id, namespace: namespace });
  }

  @Get(":namespace/:id")
  @UseGuards(NamespaceGuard)
  public async get_category(
    @Param('namespace', ValidationPipeId) namespace: string,
    @Param('id', ValidationPipeId) id: string) {
    return this.client.send("category.get", { namespace: namespace, id: id });
  }

  @Get(":namespace")
  public async list_category(
    @Param('namespace', ValidationPipeId) namespace: string) {
    return this.client.send("category.list", { namespace: namespace });
  }

  @Put(":namespace")
  @UseGuards(AuthGuard, NamespaceGuard)
  @SetMetadata("role", [Role.Author, Role.Admin])
  public async create_category(
    @Param('namespace') namespace: string,
    @Body(ValidationPipe) dto: CreateCatDto,
    @Request() request: any) {
    return this.client.send("category.create", { ...dto, author: request.user.id, namespace: namespace });
  }

  @Delete(":namespace")
  @UseGuards(AuthGuard)
  @SetMetadata("role", [Role.Author, Role.Admin])
  public async delete_category(
    @Param('namespace', ValidationPipeId) namespace: string,
    @Body(ValidationPipe) dto: DeleteCatDto,
    @Request() request: any) {
    return this.client.send("category.delete", { ...dto, user: request.user.id, namespace: namespace });
  }

}