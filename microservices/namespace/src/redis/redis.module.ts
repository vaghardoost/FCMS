import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import RedisNamespaceService from './redis.service.namespace';

@Module({
  providers: [RedisService, RedisNamespaceService],
  exports: [RedisNamespaceService],
})
export class RedisModule { }
