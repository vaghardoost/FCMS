import { RedisService } from './redis.service';
import { Injectable } from '@nestjs/common';
import { NoteModel } from '../note/note.model';
import { ConfigService } from "@nestjs/config"

@Injectable()
export class RedisNoteService {
  private readonly redisNoteName = `${this.configService.get<string>('NAME')}_note`;

  constructor(
    private readonly connection: RedisService,
    private configService: ConfigService
  ) { }

  public async addOrUpdate(note: NoteModel) {
    await this.putOnRedis(note);
    delete note.content;
    await this.connection.redis.hset(this.redisNoteName, {
      [note.id]: JSON.stringify(note),
    });
  }

  public async putOnRedis(note: NoteModel): Promise<void> {
    await this.connection.redis.set(note.id, JSON.stringify(note));
    await this.connection.redis.expire(
      note.id,
      this.configService.get<number>('REDIS_EXPIRETIME', 0) * 60,
    );
  }

  public async getNote(id: string): Promise<NoteModel | null> {
    const result = await this.connection.redis.get(id);
    return JSON.parse(result);
  }

  public async getAllNotes(): Promise<NoteModel[]> {
    const redisResult = await this.connection.redis.hgetall(this.redisNoteName);
    const result: NoteModel[] = [];
    for (const id in redisResult) {
      const note: NoteModel = JSON.parse(redisResult[id]);
      result.push(note);
    }
    return result;
  }

  public async refresh(noteList: NoteModel[]): Promise<number> {
    await this.connection.redis.del(this.redisNoteName);
    for (const note of noteList) {
      await this.addOrUpdate(note);
    }
    return 1;
  }

  public async deleteNote(id: string): Promise<number> {
    await this.connection.redis.del(id);
    return this.connection.redis.hdel(this.redisNoteName, id);
  }
}
