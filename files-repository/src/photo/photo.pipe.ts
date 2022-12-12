import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ConfigService } from '../config/config.service';

@Injectable()
export class PhotoPipe implements PipeTransform {
  constructor(private readonly configService: ConfigService) {}

  transform(value: Express.Multer.File[]): any {
    const { rate, maxSize } = this.configService.config.photo;
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
      if (
        !['image/jpeg', 'image/gif', 'image/png', 'image/jpg'].includes(
          mimetype,
        )
      ) {
        throw new HttpException(
          { statusCode: 400, message: 'file type error' },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    function calculate(): number {
      switch (rate) {
        case 'B':
          return maxSize;
        case 'KB':
          return maxSize * 1024;
        case 'MB':
          return maxSize * 1024 * 1024;
        case 'GB':
          return maxSize * 1024 * 1024 * 1024;
      }
    }
    return value;
  }
}
