import { Controller, Delete, Get, Param, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AudioPipe } from './audio.pipe';
import { AudioService } from './audio.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('audio')
export class AudioController {
  constructor(private readonly service: AudioService) { }

  @Post('upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  upload(
    @UploadedFiles(AudioPipe) photos: Express.Multer.File[],
    @Req() req: any,
  ) {
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
