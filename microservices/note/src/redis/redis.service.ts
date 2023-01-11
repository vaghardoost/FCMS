import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '../config/config.service';

@Injectable()
export class RedisService {
  public readonly redis: Redis = new Redis(
    this.configService.config.redis.port,
    this.configService.config.redis.host,
  );
  constructor(private readonly configService: ConfigService) {}
}
