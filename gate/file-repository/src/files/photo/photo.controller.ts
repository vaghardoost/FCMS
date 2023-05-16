import { Controller, Get, Post, Delete, Param, Req, UploadedFiles, UseGuards, UseInterceptors, Body } from '@nestjs/common';
import { PhotoPipe } from './photo.pipe';
import { AuthGuard } from '../../auth/auth.guard';
import { PhotoService } from './photo.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { NamespaceGuard } from 'src/guard/namespace.guard';
import { ValidationPipeId } from 'src/guard/validation.pipe';

@Controller('photo')
export class PhotoController {
  constructor(private readonly service: PhotoService) { }

  @Get(':namespace')
  list(@Param('namespace', ValidationPipeId) namespace: string) {
    return this.service.list(namespace);
  }
  
  @Post(':namespace')
  @UseGuards(AuthGuard, NamespaceGuard)
  @UseInterceptors(AnyFilesInterceptor())
  upload(
    @Req() req: any,
    @Param('namespace') namespace: string,
    @UploadedFiles(PhotoPipe) photos: Express.Multer.File[],
  ) {
    return this.service.upload(photos, req.user.id, namespace);
  }

  @Delete(':namespace/:id')
  @UseGuards(AuthGuard, NamespaceGuard)
  delete(
    @Param('namespace') namespace: string,
    @Param('id') id: string,
  ) {
    return this.service.delete(namespace, id);
  }
}
