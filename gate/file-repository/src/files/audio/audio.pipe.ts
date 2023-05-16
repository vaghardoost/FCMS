import {
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AudioPipe implements PipeTransform {
  constructor(private readonly configService: ConfigService) { }

  transform(value: Express.Multer.File[]): any {
    const [rate, maxSize] = this.configService.get<string>('AUDIO_MAXSIZE').split(' ');
    if (!value) {
      throw new HttpException(
        { statusCode: 400, message: 'undefined files' },
        HttpStatus.BAD_REQUEST,
      );
    }
    for (const file of value) {
      const { size, mimetype } = file;
      if (size > calculate()) {
        throw new HttpException(
          { statusCode: 400, message: 'file size error' },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!this.configService.get<string>('AUDIO_ACCEPT').split(' ').includes(mimetype)) {
        throw new HttpException(
          { statusCode: 400, message: 'file type error', payload: { mimetype: mimetype } },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    function calculate(): number {
      switch (rate) {
        case 'B':
          return Number.parseInt(maxSize);
        case 'KB':
          return Number.parseInt(maxSize) * 1024;
        case 'MB':
          return Number.parseInt(maxSize) * 1024 * 1024;
        case 'GB':
          return Number.parseInt(maxSize) * 1024 * 1024 * 1024;
      }
    }
    return value;
  }
}
