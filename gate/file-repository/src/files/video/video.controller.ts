import { Controller, Delete, Get, Param, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { VideoPipe } from './video.pipe';
import { VideoService } from './video.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { NamespaceGuard } from 'src/guard/namespace.guard';
import { ValidationPipeId } from 'src/guard/validation.pipe';

@Controller('video')
export class VideoController {
  constructor(private readonly service: VideoService) { }

  @Get(':namespace')
  list(@Param('namespace', ValidationPipeId) namespace: string) {
    return this.service.list(namespace);
  }

  @Delete(':namespace/:id')
  @UseGuards(AuthGuard, NamespaceGuard)
  delete(
    @Param('namespace') namespace: string,
    @Param('id') id: string,
  ) {
    return this.service.delete(namespace, id);
  }

  @Post(':namespace')
  @UseGuards(AuthGuard, NamespaceGuard)
  @UseInterceptors(AnyFilesInterceptor())
  upload(
    @UploadedFiles(VideoPipe) photos: Express.Multer.File[],
    @Req() req: any,
    @Param('namespace') namespace: string
  ) {
    return this.service.upload(photos, req.user.id, namespace);
  }
}
