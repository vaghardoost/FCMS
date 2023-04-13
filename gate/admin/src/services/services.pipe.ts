import { HttpException, HttpStatus, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ValidationPipeId implements PipeTransform {
  transform(id: string) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new HttpException('id is not validate', HttpStatus.BAD_REQUEST);
    }
    return id;
  }
}

@Injectable()
export class ValidationPipeObject implements PipeTransform {
  transform(data: any) {
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const element = data[key];
        if (!element.match(/^[0-9a-fA-F]{24}$/)) {
          throw new HttpException(`${key} is not validate`, HttpStatus.BAD_REQUEST);
        }
      }
    }
    return data;
  }
}

