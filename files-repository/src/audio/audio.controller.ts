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
import { AudioPipe } from './audio.pipe';
import { AuthGuard } from '../auth/auth.guard';
import { AudioService } from './audio.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('audio')
export class AudioController {
  constructor(private readonly service: AudioService) {}

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
