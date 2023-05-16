import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { readdirSync, statSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';

import { Code, Result } from 'src/app.result';
import { FileModel } from 'src/app.file.model';

@Injectable()
export class VideoService {
  private readonly directory:string = this.configService.get<string>('VIDEO_PATH');

  constructor(
    private readonly configService: ConfigService,
    @InjectModel('file') private readonly model: Model<FileModel>,
  ) { }

  public async upload(
    list: Express.Multer.File[],
    admin: string,
    namespace: string
  ): Promise<Result<FileModel[]>> {
    const result = [];
    
    for (const file of list) {
      const { buffer, mimetype, originalname } = file;
      const postfix = originalname.split('.').at(-1);

      const fileData: FileModel = {
        admin: admin,
        postfix: postfix,
        mimetype: mimetype,
        type: 'video',
        namespace: namespace,
      };

      const model = new this.model(fileData);
      const save = await model.save();
      fileData.id = save._id.toString();

      const path = `file/${namespace}/${this.directory}/${fileData.id}.${fileData.postfix}`;
      writeFileSync(path, buffer, {});
      result.push(fileData);
    }
    return { code: Code.Upload, success: true, payload: result };
  }

  public async list(namespace: string): Promise<Result<any>> {
    try {
      const path = join('file', namespace, this.directory)
      const files = readdirSync(path)
      let size = 0;
      files.forEach(file => size += statSync(join(path, file)).size);
      return {
        code: Code.GetList, success: true,
        payload: { size: size, files: files }
      };
    } catch {
      return { code: Code.GetList, success: false };
    }
  }

  public async delete(namespace: string, filename: string): Promise<Result<any>> {
    const id = filename.split('.')[0];
    const file = await this.model.findOneAndDelete<FileModel>({ _id: id });
    if (file) {
      const path = `/${namespace}/${this.directory}/${filename}`;
      const demo = `/${namespace}/${this.directory}/demo.${filename}`;
      unlinkSync(path)
      unlinkSync(demo)
      return { code: Code.Delete, success: true, payload: file }
    }
    return { code: Code.Delete, success: false }
  }
}
