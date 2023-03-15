import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  public readonly conn: Redis = new Redis(this.configService.get<string>('REDIS'));
  constructor(private readonly configService: ConfigService) { }
}
