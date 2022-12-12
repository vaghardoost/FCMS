import { DynamicModule, Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '../config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FileSchema } from '../app.schema';
import { RedisModule } from '../redis/redis.module';
import { ConfigModel } from 'src/config/config.model';
import { readFileSync } from 'fs';

@Module({})
export class VideoModule {
  static register():DynamicModule{
    const data: string = readFileSync('config.json', { encoding: 'utf-8' });
    const config:ConfigModel = JSON.parse(data);
    return {
      module:VideoModule,
      controllers: [VideoController],
      providers: [VideoService],
      imports: [
        RedisModule,
        ConfigModule,
        MongooseModule.forFeature([{ name: 'file', schema: FileSchema }]),
        ClientsModule.register([
          {
            name: 'kafka-client',
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: 'video.module',
                brokers: config.kafka.brokers,
              },
              consumer: {
                groupId: 'file.video',
              },
            },
          },
        ]),
      ],
    }
  }
}
