import { Injectable } from "@nestjs/common"
import { RedisService } from "./redis.service";
import ThemeModel from "src/theme/theme.model";

@Injectable()
export default class RedisThemeService {
  constructor(private readonly service: RedisService) { }
  private readonly redisName = 'namespace.theme';

  public setTheme(theme: ThemeModel) {
    this.service.redis.hset(this.redisName, { [theme.id]: JSON.stringify(theme) })
  }

  public async getAll() {
    return await this.service.redis.hgetall(this.redisName);
  }

  public async getTheme(id: string) {
    const result = await this.service.redis.hget(this.redisName, id);
    if (result) {
      return JSON.parse(result) as ThemeModel;
    }
    return null;
  }

  public async exists(id: string) {
    const data = await this.service.redis.hget(this.redisName, id);
    return (data !== null)
  }

  public async clear() {
    await this.service.redis.del(this.redisName);
  }
}