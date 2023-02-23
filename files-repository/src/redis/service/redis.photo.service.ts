import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis.service';
import { FileModel } from '../../app.file.model';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisPhotoService {
  private readonly mapName: string = this.configService.get<string>('NAME') + '-photo';

  constructor(
    private readonly redis: RedisService,
    private readonly configService: ConfigService,
  ) { }

  public async save(photo: FileModel) {
    return this.redis.conn.hset(this.mapName, {
      [photo.id]: JSON.stringify(photo),
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

  public async existsPath(path: string): Promise<boolean> {
    const result = await this.redis.conn.hgetall(this.mapName);
    for (const key in result) {
      const file: FileModel = JSON.parse(result[key]);
      if (file.path === path) {
        return true;
      }
    }
    return false;
  }

  public async clear() {
    this.redis.conn.del(this.mapName);
  }
}
