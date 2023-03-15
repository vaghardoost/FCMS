import { MiddlewareConsumer, Module, NestModule, RequestMethod, OnModuleInit, Inject } from "@nestjs/common";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MicroserviceModule } from "./microservice/base.module";
import { APP_GUARD } from "@nestjs/core"
import { ClientKafka, ClientsModule, Transport } from "@nestjs/microservices";
import { LogMiddleware } from "./middleware/log.middleware";


@Module({
  imports: [
    MicroserviceModule,
    ConfigModule.forRoot(),
    ClientsModule.registerAsync([{
      name: "kafka-client",
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'main-auth',
            brokers: configService.get<string>('KAFKA_BROKERS').split(' ')
          },
          consumer: {
            groupId: configService.get<string>('KAFKA_CONSUMER')
          }
        },
      }),
    }])
  ],
})

export class AppModule implements NestModule, OnModuleInit {
  constructor(@Inject('kafka-client') private readonly kafka: ClientKafka) { }

  async onModuleInit() {
    await this.kafka.connect()
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
