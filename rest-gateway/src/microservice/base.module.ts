import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { NoteController } from "./note/note/note.controller";
import { CategoryController } from "./note/category/category.controller";
import { AdminController } from "./admin/admin.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  controllers: [NoteController, CategoryController, AdminController],
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
            groupId: configService.get<string>('KAFKA_CONSUMER') + "-microservice"
          }
        },
      }),
    }])
  ]
})
export class MicroserviceModule { }
