import { Body, Controller, Delete, Get, Inject, OnModuleInit, Param, Patch, Post, Put, Request, SetMetadata, UseGuards, ValidationPipe } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { DeleteNoteDto } from "./dto/note.delete.dto";
import { UpdateNoteDto } from "./dto/note.update.dto";
import { CreateNoteDto } from "./dto/note.create.dto";
import { AuthGuard } from "src/auth/auth.guard";
import { Role } from "../../app.roles";
import { ValidationPipeId } from "../services.pipe";

@Controller("note")
export default class NoteController implements OnModuleInit {

  constructor(@Inject("kafka-client") private readonly client: ClientKafka) { }

  onModuleInit() {
    this.client.subscribeToResponseOf("note.get");
    this.client.subscribeToResponseOf("note.list");
    this.client.subscribeToResponseOf("note.create");
    this.client.subscribeToResponseOf("note.reload");
    this.client.subscribeToResponseOf("note.update");
    this.client.subscribeToResponseOf("note.delete");
  }

  @Patch("reload")
  @SetMetadata("role", [Role.Manager])
  @UseGuards(AuthGuard)
  async reload() {
    return this.client.send("note.reload", {});
  }

  @Delete(':namespace')
  @SetMetadata("role", [Role.Admin, Role.Author])
  @UseGuards(AuthGuard)
  public async delete(
    @Param('namespace', ValidationPipeId) namespace: string,
    @Body(ValidationPipe) { id }: DeleteNoteDto) {
    return this.client.send("note.delete", { id: id, namespace: namespace });
  }

  @Put(':namespace')
  @SetMetadata("role", [Role.Admin, Role.Author])
  @UseGuards(AuthGuard)
  public async create(
    @Param('namespace', ValidationPipeId) namespace: string,
    @Body(ValidationPipe) dto: CreateNoteDto,
    @Request() { user }: any) {
    return this.client.send("note.create", { ...dto, author: user.id, namespace: namespace });
  }

  @Get(':namespace')
  public async list(
    @Param('namespace', ValidationPipeId) namespace: string) {
    return this.client.send("note.list", { namespace: namespace });
  }

  @Get(":namespace/:id")
  public async get(
    @Param('namespace', ValidationPipeId) namespace: string,
    @Param('id', ValidationPipeId) id: string) {
    return this.client.send("note.get", { id: id, namespace: namespace });
  }

  @Post(":namespace/:id")
  @SetMetadata("role", [Role.Admin, Role.Author])
  @UseGuards(AuthGuard)
  public async update(
    @Body(ValidationPipe) dto: UpdateNoteDto,
    @Param('namespace', ValidationPipeId) namespace: string,
    @Param('id', ValidationPipeId) id: string) {
    return this.client.send("note.update", { ...dto, namespace: namespace, id: id });
  }


}