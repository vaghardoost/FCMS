import { MiddlewareConsumer, Module, NestModule, RequestMethod, OnModuleInit } from '@nestjs/common';
import { PhotoModule } from './photo/photo.module';
import { RedisModule } from './redis/redis.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './app.middleware';
import { VideoModule } from './video/video.module';
import { DocModule } from './doc/doc.module';
import { AudioModule } from './audio/audio.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as fs from "fs";

@Module({
  imports: [
    RedisModule, AuthModule, AudioModule, PhotoModule, VideoModule, DocModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO')
      })
    }),
  ],
})
export class AppModule implements NestModule, OnModuleInit {
  constructor(private readonly configService: ConfigService) { }

  async onModuleInit() {
    const paths = [
      this.configService.get<string>('PHOTO_PATH'),
      this.configService.get<string>('AUDIO_PATH'),
      this.configService.get<string>('VIDEO_PATH'),
      this.configService.get<string>('DOC_PATH')
    ]

    for (const path of paths) {
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
      }
    }
  }

  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
