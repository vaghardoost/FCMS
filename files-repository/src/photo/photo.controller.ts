import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PhotoPipe } from './photo.pipe';
import { AuthGuard } from '../auth/auth.guard';
import { PhotoService } from './photo.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('photo')
export class PhotoController {
  constructor(private readonly service: PhotoService) {}

  @Post('upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  upload(
    @UploadedFiles(PhotoPipe) photos: Express.Multer.File[],
    @Req() req: any,
  ) {
    return this.service.upload(photos, req.user.id);
  }

  @Get('list')
  @UseGuards(AuthGuard)
  list() {
    return this.service.list();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  download(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Post('reload')
  @UseGuards(AuthGuard)
  reload() {
    return this.service.reload();
  }
}
