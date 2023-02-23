import { Inject, OnModuleInit, Module } from "@nestjs/common";
import { ClientKafka, ClientsModule, Transport } from "@nestjs/microservices";
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
      useFactory: (configService:ConfigService) => ({
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
export class MicroserviceModule implements OnModuleInit {
  constructor(@Inject('kafka-client') private readonly client: ClientKafka) { }
  async onModuleInit() {
    await this.client.connect();
  }
}
