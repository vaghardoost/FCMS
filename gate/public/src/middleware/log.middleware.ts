import { NestMiddleware } from "@nestjs/common"
export class LogMiddleware implements NestMiddleware {
  use(req: Request, res: any, next: (error?: any) => void) {
    console.info("(" + req.method + ") " + req.url);
    next();
  }
}