import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { NoteController } from "./note.controller";

@Module({
  controllers: [NoteController],
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
            clientId: 'main',
            brokers: configService.get<string>('KAFKA_BROKERS').split(' ')
          },
          consumer: {
            groupId: configService.get<string>('KAFKA_CONSUMER')
          }
        },
      }),
    }])
  ]
})
export class MicroserviceModule { }
