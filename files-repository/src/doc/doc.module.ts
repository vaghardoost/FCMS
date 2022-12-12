import { DynamicModule, Module } from '@nestjs/common';
import { DocController } from './doc.controller';
import { DocService } from './doc.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '../config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FileSchema } from '../app.schema';
import { RedisModule } from '../redis/redis.module';
import { readFileSync } from 'fs';
import { ConfigModel } from 'src/config/config.model';

@Module({})
export class DocModule {
  static register():DynamicModule{
    const data: string = readFileSync('config.json', { encoding: 'utf-8' });
    const config:ConfigModel = JSON.parse(data);
    return {
      module:DocModule,
      controllers: [DocController],
      providers: [DocService],
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
