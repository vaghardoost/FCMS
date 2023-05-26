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
import { DocService } from './doc.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { NamespaceGuard } from 'src/guard/namespace.guard';
import { ValidationPipeId } from 'src/guard/validation.pipe';

@Controller('doc')
export class DocController {
  constructor(private readonly service: DocService) {}

  @Get(':namespace')
  list(@Param('namespace', ValidationPipeId) namespace: string) {
    return this.service.list(namespace);
  }
  
  @Get(':namespace/data')
  @UseGuards(AuthGuard, NamespaceGuard)
  dataList(@Param('namespace', ValidationPipeId) namespace: string) {
    return this.service.databaseList(namespace);
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
    @UploadedFiles(DocPipe) photos: Express.Multer.File[],
    @Req() req: any,
    @Param('namespace') namespace: string
  ) {
    return this.service.upload(photos, req.user.id, namespace);
  }
}
