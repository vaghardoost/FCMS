import { Controller, ValidationPipe, Delete, Get, Inject, OnModuleInit, Body, Post, Put, Param, SetMetadata, UseGuards, Request } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { NamespaceGuard } from "../namespace/guards/namespace.guard";
import { AuthGuard } from "src/auth/auth.guard";
import { Role } from "src/app.roles";
import DatapackCreateDTO from "./dto/datapack.create.dto";
import { ValidationPipeId } from "../services.pipe";
import DatapackDeleteDto from "./dto/datapack.delete.dto";
import DatapackUpdateDTO from "./dto/datapack.update.dto";

@Controller('datapack')
export default class DatapackController implements OnModuleInit {
  constructor(@Inject("kafka-client") private readonly client: ClientKafka) { }

  onModuleInit() {
    this.client.subscribeToResponseOf("datapack.create");
    this.client.subscribeToResponseOf("datapack.list");
    this.client.subscribeToResponseOf("datapack.delete");
    this.client.subscribeToResponseOf("datapack.get");
    this.client.subscribeToResponseOf("datapack.namespace");
    this.client.subscribeToResponseOf("datapack.reload");
    this.client.subscribeToResponseOf("datapack.update");
  }

  @Put(":namespace")
  @UseGuards(AuthGuard, NamespaceGuard)
  @SetMetadata("role", [Role.Author, Role.Admin])
  public create(
    @Request() req: any,
    @Body(ValidationPipe) dto: DatapackCreateDTO,
    @Param('namespace', ValidationPipeId) namespace: string,
  ) {
    return this.client.send('datapack.create', { namespace: namespace, author: req.user.id, ...dto })
  }

  @Get()
  public list() {
    return this.client.send('datapack.list', {});
  }

  @Delete(":namespace")
  @UseGuards(AuthGuard, NamespaceGuard)
  @SetMetadata("role", [Role.Author, Role.Admin])
  public delete(
    @Body(ValidationPipe) dto: DatapackDeleteDto,
    @Param('namespace', ValidationPipeId) namespace: string
  ) {
    return this.client.send('datapack.delete', { ...dto, namespace: namespace });
  }

  @Get(':id')
  public get(@Param('id', ValidationPipeId) id: string) {
    return this.client.send('datapack.get', { id: id })
  }

  @Post(":namespace/:id")
  @UseGuards(AuthGuard, NamespaceGuard)
  @SetMetadata("role", [Role.Author, Role.Admin])
  public update(
    @Body(ValidationPipe) dto: DatapackUpdateDTO,
    @Param('namespace') namespace: string,
    @Param('id', ValidationPipeId) id: string,
  ) {
    return this.client.send('datapack.update', { ...dto, namespace: namespace, id: id });
  }

  @Get('namespace/:namespace')
  public namespace(@Param('namespace', ValidationPipeId) namespace: string) {
    return this.client.send('datapack.namespace', { namespace: namespace })
  }

  @Post('reload')
  @UseGuards(AuthGuard)
  @SetMetadata("role", [Role.Operator, Role.Manager])
  public reload() {
    return this.client.send('datapack.reload', {});
  }

}