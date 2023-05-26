import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisNoteService } from './note.redis.service';
import { RedisCategoryService } from './category.redis.service';
import { ConfigModule } from "@nestjs/config"
import { RedisDatapackService } from './datapack.redis.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    RedisService,
    RedisNoteService,
    RedisCategoryService,
    RedisDatapackService,
  ],
  exports: [
    RedisNoteService,
    RedisCategoryService,
    RedisDatapackService,
  ],
})
export class RedisModule { }
