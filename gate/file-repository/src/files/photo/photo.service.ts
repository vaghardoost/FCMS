import { Injectable } from '@nestjs/common';
import { read as jimpRead } from "jimp"
import { ConfigService } from '@nestjs/config';
import { readdirSync, writeFileSync, unlinkSync, statSync } from 'fs';
import { Model } from 'mongoose';
import { FileModel } from '../../app.file.model';
import { InjectModel } from '@nestjs/mongoose';
import { Code, Result } from '../../app.result';
import { join } from 'path';

@Injectable()
export class PhotoService {

  private readonly directory:string = this.configService.get<string>('PHOTO_PATH');

  constructor(
    private readonly configService: ConfigService,
    @InjectModel('file') private readonly model: Model<FileModel>
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
        type: 'photo',
        namespace: namespace,
      };

      const model = new this.model(fileData);
      const save = await model.save();
      fileData.id = save._id.toString();

      const path = `file/${namespace}/${this.directory}/${fileData.id}.${fileData.postfix}`;
      writeFileSync(path, buffer, {});
      jimpRead(buffer, (err, image) => {
        if (err) return console.error('error to read uploaded buffer at:', err);
        const width = (image.getWidth() > 100) ? image.getWidth() / 10 : image.getWidth()
        const height = (image.getHeight() > 100) ? image.getHeight() / 10 : image.getHeight()
        const path_demo = `file/${namespace}/${this.directory}/demo.${fileData.id}.${fileData.postfix}`;
        image.resize(width, height).quality(30).write(path_demo);
      });
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
