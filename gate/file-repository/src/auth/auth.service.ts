import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { AuthDto } from './auth.dto';
import { ClientKafka } from '@nestjs/microservices';
import { Code, HeaderCode, MicroserviceRes, Result } from '../app.result';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @Inject('kafka-client') private readonly client: ClientKafka,
    private readonly configService: ConfigService,
  ) { }

  async onModuleInit() {
    this.client.subscribeToResponseOf('admin.auth');
  }

  public async auth(dto: AuthDto): Promise<Result<any>> {
    const res = this.client.send<MicroserviceRes<any>>('admin.auth', dto);
    return new Promise<Result<any>>((resolve) => {
      res.subscribe((value) => {
        const { code, payload } = value.header;
        if (code === HeaderCode.SUCCESS) {
          const secret = this.configService.get<string>('TOKEN_SECRET');
          const ttl = this.configService.get<string>('TOKEN_TTL');
          const token = sign({ ...payload, password: dto.password }, secret, { expiresIn: ttl });
          resolve({ success: true, code: Code.SignIn, payload: { token: token } });
        }
        resolve({ success: false, code: Code.SignIn });
      });
    });
  }
}
