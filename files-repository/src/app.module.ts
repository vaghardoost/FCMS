import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { PhotoModule } from './photo/photo.module';
import { RedisModule } from './redis/redis.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './app.middleware';
import { VideoModule } from './video/video.module';
import { DocModule } from './doc/doc.module';
import { AudioModule } from './audio/audio.module';
import { MongooseModule } from '@nestjs/mongoose';

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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
