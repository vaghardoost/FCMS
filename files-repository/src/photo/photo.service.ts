import {
  HttpException,
  HttpStatus,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { read as jimpRead } from "jimp"
import { ConfigService } from '../config/config.service';
import { createReadStream, readdirSync } from 'fs';
import { randomBytes } from 'crypto';
import { Model } from 'mongoose';
import { FileModel } from '../app.file.model';
import { RedisPhotoService } from '../redis/service/redis.photo.service';
import { InjectModel } from '@nestjs/mongoose';
import { Code, Result } from '../app.result';
import { join } from 'path';
import { writeFile } from 'fs/promises';

@Injectable()
export class PhotoService {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisPhotoService,
    @InjectModel('file') private readonly model: Model<FileModel>,
  ) { }

  public async upload(
    photos: Express.Multer.File[],
    admin: number,
  ): Promise<Result<FileModel[]>> {
    const result = [];
    for (const photo of photos) {
      const { buffer, mimetype } = photo;
      const postfix = mimetype.split('/')[1];
      const name = Date.now().toString() + '.' + postfix;
      const path = this.configService.config.photo.path + '/' + name;
      const demoPath = this.configService.config.photo.path + '/demo.' + name;

      writeFile(path, buffer);

      jimpRead(buffer, (err, image) => {
        if (err) return console.error('error to read uploaded buffer at:', name);
        const width = (image.getWidth() > 100) ? image.getWidth() / 10 : image.getWidth()
        const height = (image.getHeight() > 100) ? image.getHeight() / 10 : image.getHeight()
        image.resize(width, height).quality(30).write(demoPath);
      })

      const fileData: FileModel = {
        path: path,
        demo: demoPath,
        id: `${randomBytes(16).toString('hex')}.${postfix}`,
        admin: admin,
        postfix: mimetype,
        type: 'photo',
      };

      const model = new this.model(fileData);
      model.save();
      this.redisService.save(fileData);
      result.push(fileData);
    }
    return { code: Code.Upload, success: true, payload: result };
  }

  public async get(id: string, options?: { demo?: boolean }) {
    const result = await this.redisService.get(id);
    if (result) {
      const file = createReadStream(join((options?.demo) ? result.demo : result.path));
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
    const result = await this.model.find({ type: 'photo' });
    for (const photo of result) {
      await this.redisService.save(photo.toJSON());
    }
    return { code: Code.Reload, success: true };
  }

  public async delete(id: string): Promise<Result<any>> {
    const file = await this.model.findOneAndDelete<FileModel>({ id: id });
    await this.reload();
    return {
      code: Code.Delete,
      success: true,
      payload: file
    }
  }

  public async refreshStorage(): Promise<Result<string[]>> {
    await this.reload();
    const { path } = this.configService.config.photo;
    const listResult: string[] = [];
    const pathList = readdirSync(path);

    for (const filePath of pathList) {
      const result = await this.redisService.existsPath(path + "/" + filePath);
      if (!result) listResult.push(filePath);
    }

    return {
      code: Code.Storage,
      success: true,
      payload: listResult
    }
  }
}
