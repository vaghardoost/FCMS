import { Injectable } from "@nestjs/common";
import NamespaceModel from "src/namespace/namespace.model";
import { NamespaceState } from "src/namespace/namespace.state";
import { RedisService } from "./redis.service";

@Injectable()
export default class RedisNamespaceService {

  private readonly namespaceMapName = `namespace.map`;
  private readonly namespaceSpecialMapName = `namespace.special.map`;

  constructor(private readonly service: RedisService) { }

  public async allNamespaces() {
    return await this.service.redis.hgetall(this.namespaceMapName);
  }

  public async getNamespace(id: string) {
    const raw = await this.service.redis.hget(this.namespaceMapName, id);
    return (raw)
      ? JSON.parse(raw) as NamespaceModel
      : null;
  }

  public async setNamespace(id: string, data: NamespaceModel) {
    delete data['_id'];
    this.service.redis.hset(this.namespaceMapName, { [id]: JSON.stringify(data) })
  }

  public async existNamespace(id: string, author: string) {
    const data = await this.service.redis.hget(this.namespaceMapName, id);
    if (data === null) {
      return false;
    }
    const { authors, state }: NamespaceModel = JSON.parse(data);
    return authors.includes(author) && state === NamespaceState.Run;
  }

  public async clearNamespace() {
    await this.service.redis.del(this.namespaceMapName);
    await this.service.redis.del(this.namespaceSpecialMapName);
  }

  public async setSpecial(name: string, id: string) {
    this.service.redis.hset(this.namespaceSpecialMapName, name, id);
  }

  public async getSpecial(name: string) {
    const data = await this.service.redis.hget(this.namespaceSpecialMapName, name);
    if (data === null) {
      return undefined;
    }
    const id = await this.service.redis.hget(this.namespaceSpecialMapName, name);
    const namespace = await this.getNamespace(id);
    return namespace;
  }
}