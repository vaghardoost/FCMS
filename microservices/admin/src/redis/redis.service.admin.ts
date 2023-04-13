import { Injectable } from "@nestjs/common/decorators";
import { AdminModel } from "src/admin/admin.model";
import { RedisService } from "./redis.service";

@Injectable()
export class RedisAdminService {

  private readonly adminMapName = `admin.map`;

  constructor(private readonly service: RedisService) { }

  public async getAdmin(id: string): Promise<AdminModel> {
    return JSON.parse(await this.service.redis.hget(this.adminMapName, id));
  }

  public async clear() {
    this.service.redis.del(this.adminMapName);
  }

  public async setUser(id: string, user: AdminModel) {
    delete user._id;
    this.service.redis.hset(this.adminMapName, { [id]: JSON.stringify({ ...user, id: id }) });
  }

  public async isAnyAdminExists(): Promise<boolean> {
    return (await this.service.redis.exists(this.adminMapName)) === 1;
  }

  public async checkUsername(username: string): Promise<AdminModel | undefined> {
    const map = await this.service.redis.hgetall(this.adminMapName);
    for (const key in map) {
      const admin: AdminModel = JSON.parse(map[key]);
      if (admin.username === username) {
        return admin;
      }
    }
    return undefined;
  }

  public async getList() {
    const map = await this.service.redis.hgetall(this.adminMapName);
    const result: AdminModel[] = [];
    for (const key in map) {
      const admin: AdminModel = JSON.parse(map[key]);
      delete admin.password;
      result.push(admin)
    }
    return result;
  }
}