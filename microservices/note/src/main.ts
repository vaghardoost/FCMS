import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { readFileSync } from 'fs';
import { ConfigModel } from './config/config.model';

async function bootstrap() {
  const data = readFileSync('config.json', {
    encoding: 'utf-8',
  });
  const config: ConfigModel = JSON.parse(data);
  const { brokers } = config.kafka;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: brokers,
        },
        consumer: {
          groupId: 'note-consumer',
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
