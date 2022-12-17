import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DocPipe } from './doc.pipe';
import { AuthGuard } from '../auth/auth.guard';
import { DocService } from './doc.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('doc')
export class DocController {
  constructor(private readonly service: DocService) {}

  @Post('upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  upload(@UploadedFiles(DocPipe) docs: Express.Multer.File[], @Req() req: any) {
    return this.service.upload(docs, req.user.id);
  }

  @Get('list')
  list() {
    return this.service.list();
  }

  @Get('storage')
  @UseGuards(AuthGuard)
  storage(){
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
  delete(@Param('id') id:string){
    return this.service.delete(id);
  }
}
