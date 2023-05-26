import { Module } from '@nestjs/common';
import { NoteModule } from './note/note.module';
import { CategoryModule } from './category/category.module';
import { RedisModule } from './redis/redis.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import DatapackModule from './datapack/datapack.module';

@Module({
  imports: [
    NoteModule, CategoryModule, RedisModule, DatapackModule,
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (service: ConfigService) => ({
        uri: service.get<string>('MONGO')
      })
    }),
  ],
})

export class AppModule { }
