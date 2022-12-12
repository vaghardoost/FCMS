import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  public readonly conn: Redis;
  constructor(private readonly configService: ConfigService) {
    const { port, host } = configService.config.redis;
    this.conn = new Redis(port, host);
  }
}
