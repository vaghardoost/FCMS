import { MiddlewareConsumer, Module, NestModule, RequestMethod, OnModuleInit, Inject } from "@nestjs/common";
import { LogMiddleware } from './middleware/log.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MicroserviceModule } from "./microservice/base.module";
import { AuthModule } from "./module/auth/auth.module";
import { AuthMiddleware } from "./middleware/auth.middleware";
import { APP_GUARD } from "@nestjs/core"
import { AuthRoleGuard } from "./module/auth/guard/auth.role.guard";
import { ClientKafka, ClientsModule, Transport } from "@nestjs/microservices";


@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthRoleGuard
    }
  ],
  imports: [
    MicroserviceModule, AuthModule,
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
            groupId: configService.get<string>('KAFKA_CONSUMER') + "-auth"
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
    consumer.apply(AuthMiddleware).forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
