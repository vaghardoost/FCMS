import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from "@nestjs/config"

@Injectable()
export class RedisService {
  constructor(private configService: ConfigService) { }
  public readonly redis: Redis = new Redis(this.configService.get<string>('REDIS', 'localhost:6379'))
}
