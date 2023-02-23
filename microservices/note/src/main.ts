import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from "@nestjs/config"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: { brokers: configService.get<string>('KAFKA_BROKER').split(' ') },
      consumer: { groupId: configService.get<string>('KAFKA_GROUPID') },
    },
  })
  app.startAllMicroservices();
}
bootstrap();
