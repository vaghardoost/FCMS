import { DynamicModule, Module } from '@nestjs/common';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '../config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FileSchema } from '../app.schema';
import { RedisModule } from '../redis/redis.module';
import { readFileSync } from 'fs';
import { ConfigModel } from 'src/config/config.model';

@Module({})
export class PhotoModule {
  static register():DynamicModule{
    const data: string = readFileSync('config.json', { encoding: 'utf-8' });
    const config:ConfigModel = JSON.parse(data);
    return {
      module:PhotoModule,
      controllers: [PhotoController],
      providers: [PhotoService],
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
                clientId: 'photo.module',
                brokers: config.kafka.brokers,
              },
              consumer: {
                groupId: 'file.photo',
              },
            },
          },
        ]),
      ],
    }
  }
}
