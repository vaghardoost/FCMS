import { MiddlewareConsumer, Inject, Module, NestModule, RequestMethod, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth/auth.module';
import { AuthRoleGuard } from './auth/auth.role.guard';
import { AuthMiddleware } from './middleware/auth.middleware';
import { LogMiddleware } from './middleware/log.middleware';
import { ServicesModule } from './services/services.module';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthRoleGuard,
    }
  ],
  imports: [
    AuthModule,
    ServicesModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.registerAsync([{
      name: "kafka-client",
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: configService.get<string>('NAME'),
            brokers: configService.get<string>('KAFKA_BROKERS').split(' ')
          },
          consumer: {
            groupId: configService.get<string>('KAFKA_CONSUMER')
          }
        },
      }),
    }]),
  ],
})

export class AppModule implements NestModule, OnModuleInit {

  constructor(@Inject("kafka-client") private client: ClientKafka) { }

  async onModuleInit() {
    await this.client.connect();
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({ path: "*", method: RequestMethod.ALL });
    consumer.apply(LogMiddleware).forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
