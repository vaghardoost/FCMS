import { Body, Controller, Delete, Get, Inject, OnModuleInit, Param, Patch, Post, Request, SetMetadata, UseGuards, ValidationPipe } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { DeleteNoteDto } from "./dto/delete-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import { CreateNoteDto } from "./dto/create-note.dto";
import { Role } from "../../../module/auth/auth.role";
import { AuthGuard } from "../../../module/auth/guard/auth.guard";

@Controller("note")
export class NoteController implements OnModuleInit{
  constructor(@Inject('kafka-client') private readonly client:ClientKafka) {}

  onModuleInit() {
    this.client.subscribeToResponseOf("note");
    this.client.subscribeToResponseOf("note-list");
    this.client.subscribeToResponseOf("note-create");
    this.client.subscribeToResponseOf("note-refresh");
    this.client.subscribeToResponseOf("note-update");
    this.client.subscribeToResponseOf("note-delete");
  }

  @Post()
  @SetMetadata('role',[Role.Manager,Role.Author])
  @UseGuards(AuthGuard)
  async create(@Body(ValidationPipe) dto: CreateNoteDto,@Request() request:any) {
    return this.client.send('note-create', {...dto,author:request.user.id});
  }

  @Get()
  async list() {
    return this.client.send('note-list',{});
  }


  @Get(':id')
  async get(@Param('id') id: string) {
    return this.client.send('note',{id:id});
  }

  @Patch('refresh')
  @SetMetadata('role',[Role.Manager,Role.Author])
  @UseGuards(AuthGuard)
  async refresh(){
    return this.client.send('note-refresh',{});
  }

  @Patch(':id')
  @SetMetadata('role',[Role.Manager,Role.Author])
  @UseGuards(AuthGuard)
  async update(@Param('id') id:string, @Body(ValidationPipe) updateNoteDto: UpdateNoteDto) {
    return this.client.send('note-update', { ...updateNoteDto,id:id });
  }

  @Delete()
  @SetMetadata('role',[Role.Manager,Role.Author])
  @UseGuards(AuthGuard)
  async remove(@Body(ValidationPipe) deleteDto:DeleteNoteDto) {
    return this.client.send('note-delete',{id:deleteDto.id});
  }
}