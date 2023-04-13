import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { Request } from "express";

export const QueryRequired = createParamDecorator(
  (key: string, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<Request>();
    const value = req.query[key];
    if (value === undefined) {
      throw new HttpException({ message: `${key} is require as query param` }, HttpStatus.BAD_REQUEST)
    }
    return value;
  }
)
