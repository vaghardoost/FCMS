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

  public async addOrUpdate(id: string, note: NoteModel) {
    await this.putOnRedis(id, note);
    delete note.content;
    await this.connection.redis.hset(this.redisNoteName, {
      [id]: JSON.stringify(note),
    });
  }

  public async putOnRedis(id: string, note: NoteModel): Promise<void> {
    await this.connection.redis.set(id, JSON.stringify(note));
    await this.connection.redis.expire(id, this.configService.get<number>('REDIS_EXPIRETIME', 0) * 60);
  }

  public async getNote(id: string): Promise<NoteModel | null> {
    const data = await this.connection.redis.get(id);
    return data
      ? { ...JSON.parse(data), id: id }
      : null
  }

  public async getAllNotes(): Promise<NoteModel[]> {
    const redisResult = await this.connection.redis.hgetall(this.redisNoteName);
    const result: NoteModel[] = [];
    for (const id in redisResult) {
      const note: NoteModel = JSON.parse(redisResult[id]);
      result.push({ ...note, id: id });
    }
    return result;
  }

  public async refresh(noteList: NoteModel[]) {
    await this.connection.redis.del(this.redisNoteName);
    for (const note of noteList) {
      const _id = note._id;
      delete note._id;
      await this.addOrUpdate(_id, note);
    }
  }

  public async deleteNote(id: string): Promise<number> {
    await this.connection.redis.del(id);
    return this.connection.redis.hdel(this.redisNoteName, id);
  }
}
