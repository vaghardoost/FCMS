import { Inject, Module, OnModuleInit,DynamicModule } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ConfigModule } from "../config/config.module";
import { ClientKafka, ClientsModule, Transport } from "@nestjs/microservices";
import { AppConfig } from "../config/config.model";
import { readFileSync } from "fs";

export class AuthModule implements OnModuleInit{

  static register():DynamicModule{
    const data:string = readFileSync("config.json",{encoding:"utf-8"});
    const config:AppConfig  = JSON.parse(data);

    return {
      module:AuthModule,
      imports:[
        ConfigModule,
        ClientsModule.register([{
          name:"kafka-client",
          transport:Transport.KAFKA,
          options:{
            client:{
              clientId:'main',
              brokers:config.kafka.brokers
            },
            consumer:{
              groupId:config.kafka.consumer+"-auth"
            }
          },
        }])
      ],
      controllers:[AuthController],
      providers:[AuthService],
    }
  }

  constructor(@Inject('kafka-client') private readonly kafka:ClientKafka) {
  }

  async onModuleInit(){
    await this.kafka.connect()
  }
}