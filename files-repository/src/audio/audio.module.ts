import { Module } from '@nestjs/common';
import { AudioController } from './audio.controller';
import { AudioService } from './audio.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { FileSchema } from '../app.schema';
import { RedisModule } from '../redis/redis.module';
import { ConfigModule, ConfigService } from "@nestjs/config"

@Module({
  controllers: [AudioController],
  providers: [AudioService],
  imports: [
    RedisModule,
    ConfigModule,
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
              clientId: 'audio.module',
              brokers: configService.get<string>('KAFKA_BROKERS').split(' ')
            },
            consumer: { groupId: 'file.audio' },
          },
        }),
      },
    ]),
  ],
})
export class AudioModule { }
