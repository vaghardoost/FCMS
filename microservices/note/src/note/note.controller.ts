import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NoteService } from './note.service';
import { NoteFindDto } from './dto/note.find.dto';
import { NoteDeleteDto } from './dto/note.delete.dto';
import { NoteUpdateDto } from './dto/note.update.dto';
import { NoteCreateDto } from './dto/note.create.dto';

@Controller()
export class NoteController {
  constructor(private readonly service: NoteService) { }
  
  @MessagePattern('note.get')
  public get(@Payload() data: NoteFindDto) {
    return this.service.get(data);
  }

  @MessagePattern('note.list')
  public list(@Payload() data: { namespace: string }) {
    return this.service.list(data);
  }

  @MessagePattern('note.create')
  public create(@Payload() data: NoteCreateDto) {
    return this.service.create(data);
  }

  @MessagePattern('note.refresh')
  public refresh() {
    return this.service.refreshRedis();
  }

  @MessagePattern('note.delete')
  public delete(@Payload() data: NoteDeleteDto) {
    return this.service.delete(data);
  }

  @MessagePattern('note.update')
  public update(@Payload() data: NoteUpdateDto) {
    return this.service.update(data);
  }
}
