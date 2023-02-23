import { Inject, Module, OnModuleInit, DynamicModule } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientKafka, ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([{
      name: "kafka-client",
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:(configService:ConfigService)=>({
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'main',
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
export class AuthModule implements OnModuleInit {
  constructor(@Inject('kafka-client') private readonly kafka: ClientKafka) {
  }

  async onModuleInit() {
    await this.kafka.connect()
  }
}