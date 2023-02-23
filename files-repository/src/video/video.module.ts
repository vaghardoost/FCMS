import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { FileSchema } from '../app.schema';
import { RedisModule } from '../redis/redis.module';
import { ConfigModule, ConfigService } from "@nestjs/config"

@Module({
  controllers: [VideoController],
  providers: [VideoService],
  imports: [
    RedisModule,
    MongooseModule.forFeature([{ name: 'file', schema: FileSchema }]),
    ClientsModule.registerAsync([
      {
        name: 'kafka-client',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'video.module',
              brokers: configService.get<string>('KAFKA_BROKERS').split(' ')
            },
            consumer: { groupId: 'file.video' },
          },
        })
      },
    ]),
  ],
})
export class VideoModule { }
