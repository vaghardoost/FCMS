import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { AuthDto } from './auth.dto';
import { ClientKafka } from '@nestjs/microservices';
import { Code, HeaderCode, MicroserviceRes, Result } from '../app.result';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '../config/config.service';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @Inject('kafka-client') private readonly kafka: ClientKafka,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    this.kafka.subscribeToResponseOf('auth.admin');
    await this.kafka.connect();
  }

  public async auth(dto: AuthDto): Promise<Result<any>> {
    const res = this.kafka.send<MicroserviceRes<any>>('auth.admin', dto);
    return new Promise<Result<any>>((resolve) => {
      res.subscribe((value) => {
        const { code, payload } = value.header;
        if (code === HeaderCode.SUCCESS) {
          const { secret } = this.configService.config.token;
          const token = sign({ ...payload, password: dto.password }, secret);
          resolve({
            success: true,
            code: Code.SignIn,
            payload: { token: token },
          });
        }
        resolve({ success: false, code: Code.SignIn });
      });
    });
  }
}
