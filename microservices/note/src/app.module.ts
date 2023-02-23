import { DynamicModule, Module, OnModuleInit } from '@nestjs/common';
import { NoteModule } from './note/note.module';
import { CategoryModule } from './category/category.module';
import { RedisModule } from './redis/redis.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    NoteModule, CategoryModule, RedisModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost:27017/note_cms'),
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (service: ConfigService) => ({
    //     uri: service.get<string>('MONGO')
    //   })
    // }),
  ],
})

export class AppModule { }
