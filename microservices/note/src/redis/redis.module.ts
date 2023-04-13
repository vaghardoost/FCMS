import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisNoteService } from './note.redis.service';
import { RedisCategoryService } from './category.redis.service';
import { ConfigModule } from "@nestjs/config"

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [RedisService, RedisNoteService, RedisCategoryService],
  exports: [RedisNoteService, RedisCategoryService],
})
export class RedisModule { }
