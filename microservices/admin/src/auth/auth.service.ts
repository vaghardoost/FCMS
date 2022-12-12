import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { Code, HeaderCode, MicroserviceRes } from '../app.result';
import { AuthDto } from './auth.dto';
import { createHash } from 'crypto';
import { AdminModel } from '../admin/admin.model';

@Injectable()
export class AuthService {
  constructor(private readonly redisService: RedisService) {}

  public async auth(dto: AuthDto): Promise<MicroserviceRes<AdminModel>> {
    const { username, password } = dto;
    const admin = await this.redisService.checkUsername(username);
    let result = false;
    if (admin) {
      result = this.hash(password) === admin.password;
      delete admin['password'];
    }
    return {
      header: {
        code: result ? HeaderCode.SUCCESS : HeaderCode.NOT_EXISTS,
        payload: admin,
      },
      response: {
        code: Code.SignIn,
        success: result,
      },
    };
  }

  private hash(password: string): string {
    return createHash('sha256').update(password).digest('hex');
  }
}
