import {
  HttpException,
  HttpStatus,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { createReadStream, readdirSync, writeFileSync } from 'fs';
import { randomBytes } from 'crypto';
import { Model } from 'mongoose';
import { FileModel } from '../app.file.model';
import { InjectModel } from '@nestjs/mongoose';
import { Code, Result } from '../app.result';
import { join } from 'path';
import { RedisVideoService } from '../redis/service/redis.video.service';

@Injectable()
export class DocService {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisVideoService,
    @InjectModel('file') private readonly model: Model<FileModel>,
  ) {}

  public async upload(
    photos: Express.Multer.File[],
    admin: number,
  ): Promise<Result<FileModel[]>> {
    const result = [];
    for (const photo of photos) {
      const { buffer, mimetype } = photo;
      const postfix = mimetype.split('/')[1];
      const name = Date.now().toString() + '.' + postfix;
      const path = this.configService.config.doc.path + '/' + name;
      writeFileSync(path, buffer);
      const fileData: FileModel = {
        path: path,
        demo: '',
        id: randomBytes(16).toString('hex'),
        admin: admin,
        postfix: mimetype,
        type: 'doc',
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
    const result = await this.model.find({ type: 'doc' });
    for (const doc of result) {
      await this.redisService.save(doc.toJSON());
    }
    return { code: Code.Reload, success: true };
  }

  public async delete(id:string):Promise<Result<any>> {
    const file = await this.model.findOneAndDelete<FileModel>({id:id});
    await this.reload();
    return {
      code:Code.Delete,
      success:true,
      payload:file
    }
  }

  public async refreshStorage():Promise<Result<string[]>> {
    await this.reload();
    const listResult:string[] = [];
    const {path} = this.configService.config.doc;
    const pathList = readdirSync(path);

    for (const filePath of pathList) {
      const result = await this.redisService.existsPath(path + "/" + filePath);
      if (!result) listResult.push(filePath);
    }

    return {
      code:Code.Storage,
      success:true,
      payload:listResult
    }
  }
}
