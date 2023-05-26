import { Module } from "@nestjs/common";
import DatapackController from "./datapack.controller";
import { DatapackService } from "./datapack.service";
import { RedisModule } from "src/redis/redis.module";
import { MongooseModule } from "@nestjs/mongoose";
import { DatapackSchema } from "./datapack.schema";

@Module({
  controllers: [DatapackController],
  providers: [DatapackService],
  imports: [
    RedisModule,
    MongooseModule.forFeature([{ name: 'datapack', schema: DatapackSchema }]),
  ]
})
export default class DatapackModule {

}