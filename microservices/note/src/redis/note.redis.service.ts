import { RedisService } from './redis.service';
import { Injectable } from '@nestjs/common';
import { NoteModel } from '../note/note.model';
import { ConfigService } from "@nestjs/config"

@Injectable()
export class RedisNoteService {
  private readonly redisNoteName = `${this.configService.get<string>('NAME')}.notelist`;

  constructor(
    private readonly connection: RedisService,
    private configService: ConfigService
  ) { }

  public async setNote(id: string, note: NoteModel) {
    delete note['_id'];
    await this.saveExpireable(id, note);
    delete note.content;
    await this.connection.redis.hset(this.redisNoteName, {
      [id]: JSON.stringify(note),
    });
  }

  public async saveExpireable(id: string, note: NoteModel): Promise<void> {
    delete note['_id'];
    await this.connection.redis.set(id, JSON.stringify(note));
    await this.connection.redis.expire(id, this.configService.get<number>('REDIS_EXPIRETIME', 0) * 60);
  }

  public async getNote(id: string, namespace: string): Promise<NoteModel | null> {
    const raw = await this.connection.redis.get(id);
    if (raw) {
      const data: NoteModel = { ...JSON.parse(raw), id: id };
      return (data.namespace === namespace) ? data : null
    }
    return null;
  }

  public async getAllNotes(namespace: string): Promise<NoteModel[]> {
    const redisResult = await this.connection.redis.hgetall(this.redisNoteName);
    const result: NoteModel[] = [];
    for (const id in redisResult) {
      const note: NoteModel = { ...JSON.parse(redisResult[id]), id: id };
      if (note.namespace === namespace) {
        result.push(note);
      }
    }
    return result;
  }

  public async refresh(noteList: NoteModel[]) {
    await this.connection.redis.del(this.redisNoteName);
    for (const note of noteList) {
      const _id = note._id;
      delete note._id;
      await this.setNote(_id, note);
    }
  }

  public async deleteNote(id: string): Promise<number> {
    await this.connection.redis.del(id);
    return this.connection.redis.hdel(this.redisNoteName, id);
  }
}
