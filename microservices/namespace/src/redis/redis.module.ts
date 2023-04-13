import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import RedisNamespaceService from './redis.service.namespace';
import RedisThemeService from './redis.service.theme';

@Module({
  providers: [RedisService, RedisNamespaceService, RedisThemeService],
  exports: [RedisNamespaceService, RedisThemeService],
})
export class RedisModule { }
