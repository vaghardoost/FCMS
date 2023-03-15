import { Controller, Get, Post, Delete, Param, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { PhotoPipe } from './photo.pipe';
import { AuthGuard } from '../../auth/auth.guard';
import { PhotoService } from './photo.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('photo')
export class PhotoController {
  constructor(private readonly service: PhotoService) { }

  @Post('upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  upload(@UploadedFiles(PhotoPipe) photos: Express.Multer.File[], @Req() req: any) {
    return this.service.upload(photos, req.user.id);
  }

  @Get('list')
  list() {
    return this.service.list();
  }

  @Get('storage')
  @UseGuards(AuthGuard)
  storage() {
    return this.service.refreshStorage();
  }

  @Get(':id')
  download(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Get('demo/:id')
  demo(@Param('id') id: string) {
    return this.service.get(id, { demo: true });
  }

  @Post('reload')
  @UseGuards(AuthGuard)
  reload() {
    return this.service.reload();
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
