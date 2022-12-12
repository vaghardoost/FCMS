import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis.service';
import { FileModel } from '../../app.file.model';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class RedisAudioService {
  private readonly mapName: string;

  constructor(
    private readonly redis: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.mapName = configService.config.name + '-audio';
  }

  public async save(audio: FileModel) {
    return this.redis.conn.hset(this.mapName, {
      [audio.id]: JSON.stringify(audio),
    });
  }

  public async get(id: string): Promise<FileModel | null> {
    const result = await this.redis.conn.hget(this.mapName, id);
    if (result) {
      return JSON.parse(result);
    } else {
      return null;
    }
  }

  public async list() {
    const result = await this.redis.conn.hgetall(this.mapName);
    const list: FileModel[] = [];
    for (const key in result) {
      const file: FileModel = JSON.parse(result[key]);
      delete file.path;
      list.push(file);
    }
    return list;
  }

  public async clear() {
    this.redis.conn.del(this.mapName);
  }
}
