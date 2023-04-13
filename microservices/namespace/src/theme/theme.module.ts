import { Module } from "@nestjs/common";
import { RedisModule } from "src/redis/redis.module";
import ThemeController from "./theme.controller";
import ThemeService from "./theme.service";
import { MongooseModule } from "@nestjs/mongoose";
import themeSchema from "./theme.schema";

@Module({
  imports: [
    RedisModule,
    MongooseModule.forFeature([{ schema: themeSchema, name: 'theme' }]),
  ],
  controllers: [ThemeController],
  providers: [ThemeService],
})
export default class ThemeModule { }