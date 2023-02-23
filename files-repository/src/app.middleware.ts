import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from "@nestjs/config"
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) { }

  use(req: any, res: any, next: (error?: any) => void) {
    const auth = req.headers.authorization;
    const accessToken = auth && auth.split(' ')[1];
    if (auth && accessToken) {
      try {
        req.user = verify(
          accessToken,
          this.configService.get<string>('TOKEN_SECRET'),
        );
      } catch {
        throw new HttpException('bad token', HttpStatus.UNAUTHORIZED);
      }
    }
    return next();
  }
}
