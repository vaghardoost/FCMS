import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ValidationPipeParam implements PipeTransform {
  transform(id: string) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new HttpException('id is not validate', HttpStatus.BAD_REQUEST);
    }
    return id;
  }
}


