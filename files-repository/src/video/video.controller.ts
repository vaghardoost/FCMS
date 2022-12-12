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
import { VideoPipe } from './video.pipe';
import { AuthGuard } from '../auth/auth.guard';
import { VideoService } from './video.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('video')
export class VideoController {
  constructor(private readonly service: VideoService) {}

  @Post('upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  upload(
    @UploadedFiles(VideoPipe) photos: Express.Multer.File[],
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
  // @UseGuards(AuthGuard)
  download(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Post('reload')
  @UseGuards(AuthGuard)
  reload() {
    return this.service.reload();
  }
}
