import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisAdminService } from './redis.service.admin';

@Module({
  providers: [RedisService, RedisAdminService],
  exports: [RedisAdminService],
})
export class RedisModule { }
