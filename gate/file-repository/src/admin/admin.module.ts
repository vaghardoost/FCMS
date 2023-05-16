import { Module } from "@nestjs/common";
import AdminController from "./admin.controller";
import AdminService from "./admin.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import AuthModule from "src/auth/auth.module";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [
    ConfigModule,
    AuthModule,
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
            consumer: { groupId: configService.get<string>('KAFKA_CONSUMER') },
          }
        }),
      }
    ]),
  ]
})
export default class AdminModule { }