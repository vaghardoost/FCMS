import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { sign } from 'jsonwebtoken';
import { MicroserviceRes, Result, HeaderCode } from 'src/app.result';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @Inject('kafka-client') private readonly client: ClientKafka,
    private readonly configService: ConfigService,
  ) { }

  async onModuleInit() {
    this.client.subscribeToResponseOf('admin.auth');
  }

  public async auth(dto: AuthDto) {
    const res = this.client.send<MicroserviceRes<any>, string>('admin.auth', JSON.stringify(dto));
    return new Promise<Result<any>>(resolve => {
      res.subscribe(message => {
        const { header, response } = message;
        if (header.code === HeaderCode.SUCCESS) {
          const secret = this.configService.get<string>('TOKEN_SECRET');
          const ttl = this.configService.get<string>('TOKEN_TTL');
          const { payload } = header
          response.payload = { token: sign({ ...payload }, secret, { expiresIn: ttl || '0' }) }
        }
        resolve(response)
      })
    })
  }


}
