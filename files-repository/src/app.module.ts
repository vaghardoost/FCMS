import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PhotoModule } from './photo/photo.module';
import { RedisModule } from './redis/redis.module';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './app.middleware';
import { VideoModule } from './video/video.module';
import { DocModule } from './doc/doc.module';
import { AudioModule } from './audio/audio.module';

@Module({
  imports: [
    RedisModule,
    ConfigModule.register(),
    AuthModule.register(),
    AudioModule.register(),
    PhotoModule.register(),
    VideoModule.register(),
    DocModule.register(),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
