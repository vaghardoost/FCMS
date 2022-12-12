import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '../config/config.service';
import { AdminModel } from '../admin/admin.model';

@Injectable()
export class RedisService {
  private readonly conn: Redis;
  private readonly adminMapName = this.configService.config.name + '_admin';

  constructor(private readonly configService: ConfigService) {
    const { port, host } = configService.config.redis;
    this.conn = new Redis(port, host);
  }

  public async addUser(id: number, user: AdminModel): Promise<number> {
    return this.conn.hset(this.adminMapName, { [id]: JSON.stringify(user) });
  }

  public async isAnyAdminExists(): Promise<boolean> {
    return (await this.conn.exists(this.adminMapName)) === 1;
  }

  public async checkUsername(username: string): Promise<AdminModel | null> {
    const map = await this.conn.hgetall(this.adminMapName);
    for (const key in map) {
      const admin: AdminModel = JSON.parse(map[key]);
      if (admin.username === username) {
        return admin;
      }
    }
    return null;
  }
}
