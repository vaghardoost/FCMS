import {
  HttpException,
  HttpStatus,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { createReadStream, writeFileSync } from 'fs';
import { randomBytes } from 'crypto';
import { Model } from 'mongoose';
import { FileModel } from '../app.file.model';
import { InjectModel } from '@nestjs/mongoose';
import { Code, Result } from '../app.result';
import { join } from 'path';
import { RedisAudioService } from '../redis/service/redis.audio.service';

@Injectable()
export class AudioService {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisAudioService,
    @InjectModel('file') private readonly model: Model<FileModel>,
  ) {}

  public async upload(
    audios: Express.Multer.File[],
    admin: number,
  ): Promise<Result<FileModel[]>> {
    const result = [];
    for (const audio of audios) {
      const { buffer, mimetype } = audio;
      const postfix = mimetype.split('/')[1];
      const name = Date.now().toString() + '.' + postfix;
      const path = this.configService.config.audio.path + '\\' + name;
      writeFileSync(path, buffer);
      const fileData: FileModel = {
        path: path,
        id: randomBytes(16).toString('hex'),
        admin: admin,
        postfix: mimetype,
        type: 'audio',
      };
      const model = new this.model(fileData);
      await model.save();
      await this.redisService.save(fileData);
      result.push(fileData);
    }
    return { code: Code.Upload, success: true, payload: result };
  }

  public async get(id: string) {
    const result = await this.redisService.get(id);
    if (result) {
      const file = createReadStream(join(result.path));
      return new StreamableFile(file, { type: result.postfix });
    }
    throw new HttpException(
      { statusCode: 400, message: 'file token is invalid' },
      HttpStatus.BAD_REQUEST,
    );
  }

  public async list(): Promise<Result<FileModel[]>> {
    const list = await this.redisService.list();
    return {
      code: Code.GetList,
      success: true,
      payload: list,
    };
  }

  public async reload(): Promise<Result<any>> {
    await this.redisService.clear();
    const result = await this.model.find({ type: 'audio' });
    for (const photo of result) {
      await this.redisService.save(photo.toJSON());
    }
    return { code: Code.Reload, success: true };
  }
}
