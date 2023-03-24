import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AdminController } from "./admin/admin.controller";
import NamespaceController from "./namespace/namespace.controller";
import { NoteController } from "./note/note.controller";

@Module({
  controllers: [
    NoteController,
    AdminController,
    NamespaceController
  ],
  imports: [
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
            groupId: configService.get<string>('KAFKA_CONSUMER') + '-microservice'
          }
        },
      }),
    }])
  ]
})
export class ServicesModule { }
