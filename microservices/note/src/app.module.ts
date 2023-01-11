import { Module } from '@nestjs/common';
import { NoteModule } from './note/note.module';
import { CategoryModule } from './category/category.module';
import { RedisModule } from './redis/redis.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [NoteModule, CategoryModule, RedisModule, ConfigModule.register()],
})
export class AppModule {}
