import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { ConfigService } from './config/config.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: any, res: any, next: (error?: any) => void) {
    const auth = req.headers.authorization;
    const accessToken = auth && auth.split(' ')[1];
    if (auth && accessToken) {
      try {
        req.user = verify(accessToken, this.configService.config.token.secret);
      } catch {
        throw new HttpException('bad token', HttpStatus.UNAUTHORIZED);
      }
    }
    return next();
  }
}
