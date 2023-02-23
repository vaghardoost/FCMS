import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisNoteService } from './redis.service.note.';
import { RedisCategoryService } from './redis.service.cat';
import { ConfigModule } from "@nestjs/config"

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [RedisService, RedisNoteService, RedisCategoryService],
  exports: [RedisNoteService, RedisCategoryService],
})
export class RedisModule { }
