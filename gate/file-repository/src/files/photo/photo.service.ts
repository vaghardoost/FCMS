import { Injectable } from '@nestjs/common';
import { read as jimpRead } from "jimp"
import { ConfigService } from '@nestjs/config';
import { readdirSync, writeFileSync, unlinkSync, statSync, existsSync, mkdirSync } from 'fs';
import { Model } from 'mongoose';
import { FileModel } from '../../app.file.model';
import { InjectModel } from '@nestjs/mongoose';
import { Code, Result } from '../../app.result';
import { join } from 'path';

@Injectable()
export class PhotoService {

  private readonly directory: string = this.configService.get<string>('PHOTO_PATH');
  private readonly width: number = Number.parseInt(this.configService.get('DEMO_PHOTO_WIDTH'));
  private readonly quality: number = Number.parseInt(this.configService.get('DEMO_PHOTO_QUALITY'));

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

    for (const { buffer, mimetype, originalname } of list) {
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

      const dir = `file/${namespace}/${this.directory}`;
      const filename = `${fileData.id}.${fileData.postfix}`;

      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }

      const path = `${dir}/${filename}`;

      writeFileSync(path, buffer, {});
      jimpRead(buffer, (err, image) => {
        if (err) return console.error('error to read uploaded buffer at:', err);
        const z = (image.getHeight() * this.width) / image.getWidth();
        const path_demo = `file/${namespace}/${this.directory}/demo.${fileData.id}.${fileData.postfix}`;
        image.resize(this.width, z).quality(this.quality).write(path_demo);
      });
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
      const demo = `file/${namespace}/${this.directory}/demo.${filename}`;
      unlinkSync(path);
      unlinkSync(demo);
    }
    const id = filename.split('.')[0];
    const file = await this.model.findOneAndDelete<FileModel>({ _id: id });
    return { code: Code.Delete, success: true, payload: file }
  }

}
