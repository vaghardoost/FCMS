import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisPhotoService } from './service/redis.photo.service';
import { RedisAudioService } from './service/redis.audio.service';
import { RedisDocService } from './service/redis.doc.service';
import { RedisVideoService } from './service/redis.video.service';

@Module({
  providers: [
    RedisService,
    RedisPhotoService,
    RedisDocService,
    RedisVideoService,
    RedisAudioService,
  ],
  exports: [
    RedisPhotoService,
    RedisAudioService,
    RedisDocService,
    RedisVideoService,
  ],
})
export class RedisModule {}
