import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync, readdirSync, statSync, unlinkSync, writeFileSync } from 'fs';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { join } from 'path';
import { FileModel } from 'src/app.file.model';
import { Code, Result } from 'src/app.result';

@Injectable()
export class DocService {
  private readonly directory:string = this.configService.get<string>('DOC_PATH');

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
        type: 'doc',
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

  public async databaseList(namespace: string): Promise<Result<any>> {
    const result = await this.model.find<FileModel>({ namespace: namespace, type: 'photo' }, { __v: 0 });
    return { code: Code.GetList, success: true, payload: result };
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
    const path = `file/${namespace}/${this.directory}/${filename}`;
    if (existsSync(path)) {
      unlinkSync(path);
    }
    const id = filename.split('.')[0];
    const file = await this.model.findOneAndDelete<FileModel>({ _id: id, namespace: namespace });
    return { code: Code.Delete, success: true, payload: file }
  }
}
