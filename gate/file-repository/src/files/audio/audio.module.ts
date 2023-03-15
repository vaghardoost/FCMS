import { Module } from '@nestjs/common';
import { AudioController } from './audio.controller';
import { AudioService } from './audio.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from "@nestjs/config"
import { RedisModule } from 'src/redis/redis.module';
import { FileSchema } from 'src/app.schema';

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
            consumer: { groupId: configService.get<string>('KAFKA_CONSUMER') },
          },
        }),
      },
    ]),
  ],
})
export class AudioModule { }
