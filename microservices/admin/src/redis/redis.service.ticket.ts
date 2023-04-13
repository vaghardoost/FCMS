import { Injectable } from "@nestjs/common"
import TicketModel from "src/ticket/ticket.model";
import { RedisService } from "./redis.service";

@Injectable()
export default class RedisTicketService {
  
  private readonly redisName = 'admin.ticket';

  constructor(private readonly service: RedisService) { }

  public async setTicket(ticket: TicketModel) {
    this.service.redis.hset(this.redisName, { [ticket.id]: JSON.stringify(ticket) })
  }

  public async deleteTicket(id: string) {
    this.service.redis.hdel(this.redisName, id);
  }

  public async getTicket(id: string) {
    return JSON.parse(await this.service.redis.hget(this.redisName, id)) as TicketModel;
  }

  public async getAll() {
    return this.service.redis.hgetall(this.redisName);
  }

  public async clear() {
    return this.service.redis.del(this.redisName);
  }

}
