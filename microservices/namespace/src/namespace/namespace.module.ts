import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RedisModule } from "src/redis/redis.module";
import NamespaceController from "./namespace.controller";
import namespaceSchema from "./namespace.schema";
import namespaceSpecialSchema from "./namespace.special.schema";
import NamespaceService from "./namespace.service";
@Module({
  controllers: [NamespaceController],
  providers: [NamespaceService],
  imports: [
    RedisModule,
    MongooseModule.forFeature([{ name: 'Namespace', schema: namespaceSchema }]),
    MongooseModule.forFeature([{ name: 'NamespaceSpecial', schema: namespaceSpecialSchema }]),
  ],
})
export default class NamespaceModule { }
