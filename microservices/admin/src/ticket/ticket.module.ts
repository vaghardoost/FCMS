import { Module } from "@nestjs/common";
import TickerController from "./ticket.controller";
import TicketService from "./ticket.service";
import { MongooseModule } from "@nestjs/mongoose";
import { RedisModule } from "src/redis/redis.module";
import { TicketSchema } from "./ticket.shcema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ticket', schema: TicketSchema }]),
    RedisModule
  ],
  controllers: [TickerController],
  providers: [TicketService]
})
export default class TicketModule { }
