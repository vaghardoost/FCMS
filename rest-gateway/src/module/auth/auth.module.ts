import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    ConfigModule,
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
  controllers: [AuthController],
  providers: [AuthService],
})

export class AuthModule { }