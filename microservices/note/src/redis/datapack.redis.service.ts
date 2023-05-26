import { ConfigService } from "@nestjs/config";
import { RedisService } from "./redis.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RedisDatapackService {
  private readonly redisDatapackName = `${this.configService.get<string>('NAME')}.datapack`;

  constructor(
    private readonly connection: RedisService,
    private configService: ConfigService
  ) { }

  public setDatapack(id: string, datapack: any) {
    this.connection.redis.hset(this.redisDatapackName, { [id]: JSON.stringify(datapack) });
  }

  public all() {
    return this.connection.redis.hgetall(this.redisDatapackName);
  }

  public deleteDatapack(id: string) {
    this.connection.redis.hdel(this.redisDatapackName, id);
  }

  public get(id: string) {
    return this.connection.redis.hget(this.redisDatapackName, id);
  }

  public clear() {
    return this.connection.redis.del(this.redisDatapackName);
  }

}