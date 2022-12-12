import { DynamicModule, Inject, OnModuleInit,Module } from "@nestjs/common";
import { ClientKafka, ClientsModule, Transport } from "@nestjs/microservices";
import { NoteController } from "./note/note/note.controller";
import { CategoryController } from "./note/category/category.controller";
import { AdminController } from "./admin/admin.controller";
import { ConfigModule } from "../module/config/config.module";
import { readFileSync } from "fs";
import { AppConfig } from "../module/config/config.model";

export class MicroserviceModule implements OnModuleInit{
  /**
   * Redis Module Should be import into this module for Role Guard
   */
  public static register():DynamicModule{
    const data:string = readFileSync("config.json",{encoding:"utf-8"});
    const config:AppConfig  = JSON.parse(data);    
    return {
      global: false,
      module: MicroserviceModule,
      controllers:[
        NoteController,
        CategoryController,
        AdminController,
      ],
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
              groupId:config.kafka.consumer+"-microservice"
            }
          },
        }])
      ]
    }
  }

  constructor(@Inject('kafka-client') private readonly client:ClientKafka) {}

  async onModuleInit() {
    await this.client.connect();
  }

}
