import { Body, Controller, Delete, Get, Inject, OnModuleInit, Param, Patch, Post, Request, SetMetadata, UseGuards, ValidationPipe } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { DeleteNoteDto } from "./dto/delete-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import { CreateNoteDto } from "./dto/create-note.dto";
import { AuthGuard } from "src/guard/auth.guard";
import { UpdateCatDto } from "./dto/update-cat.dto";
import { CreateCatDto } from "./dto/create-cat.dto";
import { DeleteCatDto } from "./dto/delete-cat.dto";
import { Role } from "../../app.roles";

@Controller("note")
export class NoteController implements OnModuleInit {

  constructor(@Inject("kafka-client") private readonly client: ClientKafka) { }

  onModuleInit() {
    this.client.subscribeToResponseOf("note");
    this.client.subscribeToResponseOf("note-list");
    this.client.subscribeToResponseOf("note-create");
    this.client.subscribeToResponseOf("note-refresh");
    this.client.subscribeToResponseOf("note-update");
    this.client.subscribeToResponseOf("note-delete");

    this.client.subscribeToResponseOf("category");
    this.client.subscribeToResponseOf("category-refresh");
    this.client.subscribeToResponseOf("category-list");
    this.client.subscribeToResponseOf("category-update");
    this.client.subscribeToResponseOf("category-create");
    this.client.subscribeToResponseOf("category-delete");
  }

  // category routes

  @Patch("category/refresh")
  @UseGuards(AuthGuard)
  @SetMetadata("role", [Role.Manager])
  public async refresh_category_category() {
    return this.client.send("category-refresh", {});
  }

  @Get("category/:id")
  public async get_category(@Param("id") id: string) {
    return this.client.send("category", { id: id });
  }

  @Get("category")
  public async list_category() {
    return this.client.send("category-list", {});
  }

  @Patch("category/:id")
  @UseGuards(AuthGuard)
  @SetMetadata("role", [Role.Manager])
  public async update_category(@Param("id") id: string, @Body(ValidationPipe) dto: UpdateCatDto) {
    return this.client.send("category-update", { ...dto, id: id });
  }

  @Post("category")
  @UseGuards(AuthGuard)
  @SetMetadata("role", [Role.Manager])
  public async create_category(@Body(ValidationPipe) dto: CreateCatDto, @Request() request: any) {
    return this.client.send("category-create", { ...dto, admin: request.user.id });
  }

  @Delete("category")
  @UseGuards(AuthGuard)
  @SetMetadata("role", [Role.Manager])
  public async delete_category(@Body(ValidationPipe) dto: DeleteCatDto, @Request() request: any) {
    return this.client.send("category-delete", { ...dto, user: request.user.id });
  }

  // note routes

  @Post()
  @SetMetadata("role", [Role.Manager, Role.Author])
  @UseGuards(AuthGuard)
  async create(@Body(ValidationPipe) dto: CreateNoteDto, @Request() request: any) {
    return this.client.send("note-create", { ...dto, author: request.user.id });
  }

  @Get()
  async list() {
    return this.client.send("note-list", {});
  }


  @Get(":id")
  async get(@Param("id") id: string) {
    return this.client.send("note", { id: id });
  }

  @Patch("refresh")
  @SetMetadata("role", [Role.Manager])
  @UseGuards(AuthGuard)
  async refresh() {
    return this.client.send("note-refresh", {});
  }

  @Patch(":id")
  @SetMetadata("role", [Role.Manager, Role.Author])
  @UseGuards(AuthGuard)
  async update(@Body(ValidationPipe) dto: UpdateNoteDto, @Param("id") id: string) {
    return this.client.send("note-update", { ...dto, id: id });
  }

  @Delete()
  @SetMetadata("role", [Role.Manager, Role.Author])
  @UseGuards(AuthGuard)
  async remove(@Body(ValidationPipe) deleteDto: DeleteNoteDto) {
    return this.client.send("note-delete", { id: deleteDto.id });
  }

}