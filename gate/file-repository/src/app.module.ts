import * as fs from "fs";

import { MiddlewareConsumer, Module, NestModule, RequestMethod, OnModuleInit, Inject } from '@nestjs/common';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import AuthModule from './auth/auth.module';
import AuthMiddleware from './app.middleware';

import PhotoModule from './files/photo/photo.module';
import VideoModule from './files/video/video.module';
import DocModule from './files/doc/doc.module';
import AudioModule from './files/audio/audio.module';
import AdminModule from './admin/admin.module';
import { join } from "path";


@Module({
  imports: [
    AdminModule, AuthModule, AudioModule, PhotoModule, VideoModule, DocModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO')
      })
    }),
    ClientsModule.registerAsync([
      {
        name: 'kafka-client',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'file',
              brokers: configService.get<string>('KAFKA_BROKERS').split(' ')
            },
            consumer: { groupId: 'file.auth' },
          }
        }),
      }
    ]),
  ],
})
export class AppModule implements NestModule, OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    @Inject("kafka-client") private client: ClientKafka
  ) { }

  async onModuleInit() {
    this.client.subscribeToResponseOf("namespace.list");
    await this.client.connect();
    const res = this.client.send<any[]>('namespace.list', {});
    const { payload } = await new Promise<any>(resolve => {
      res.subscribe(response => { resolve(response) })
    });

    payload.forEach((namespace: { id: string }) => {
      const list = [
        this.configService.get<string>('PHOTO_PATH'),
        this.configService.get<string>('AUDIO_PATH'),
        this.configService.get<string>('VIDEO_PATH'),
        this.configService.get<string>('DOC_PATH'),
      ]

      list.forEach(dir => {
        const exists = fs.existsSync(dir);
        const directory = join('file', namespace.id, dir)
        if (!exists) {
          fs.mkdirSync(directory, { recursive: true });
        }
      })

    });
  }

  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AuthMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
