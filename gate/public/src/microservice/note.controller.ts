import { Controller, Get, Inject, OnModuleInit, Param } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

@Controller("note")
export class NoteController implements OnModuleInit {
  constructor(@Inject('kafka-client') private readonly client: ClientKafka) { }

  onModuleInit() {
    this.client.subscribeToResponseOf("note");
    this.client.subscribeToResponseOf("note-list");
    this.client.subscribeToResponseOf("category");
    this.client.subscribeToResponseOf("category-list");
  }

  @Get()
  async list() {
    return this.client.send('note-list', {});
  }
  
  @Get('category')
  public async catgeory_list() {
    return this.client.send('category-list', {});
  }
  
  @Get("category/:id")
  public async catgeory_get(@Param('id') id: string) {
    return this.client.send('category', { id: id });
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.client.send('note', { id: id });
  }

}