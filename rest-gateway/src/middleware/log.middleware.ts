import { Injectable, NestMiddleware } from "@nestjs/common";

@Injectable()
export class LogMiddleware implements NestMiddleware {
    use(req: Request, res: any, next: (error?: any) => void) {
        // console.log("("+req.method+") "+req.url);
        next();
    }
}