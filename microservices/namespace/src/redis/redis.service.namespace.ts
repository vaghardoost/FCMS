import { Injectable } from "@nestjs/common";
import NamespaceModel from "src/namespace/namespace.model";
import { NamespaceState } from "src/namespace/namespace.state";
import { RedisService } from "./redis.service";

@Injectable()
export default class RedisNamespaceService {

  private readonly namespaceMapName = `namespace.map`;

  constructor(private readonly service: RedisService) { }

  public async allNamespaces() {
    return await this.service.redis.hgetall(this.namespaceMapName);
  }

  public async getNamespace(id: string) {
    const result: NamespaceModel = JSON.parse(await this.service.redis.hget(this.namespaceMapName, id));
    return result;
  }

  public async setNamespace(id: string, data: NamespaceModel) {
    delete data['_id'];
    this.service.redis.hset(this.namespaceMapName, { [id]: JSON.stringify(data) })
  }

  public async existNamespace(id: string, author: string) {
    const data = await this.service.redis.hget(this.namespaceMapName, id);
    if (!data) {
      return false;
    }
    const { authors, state }: NamespaceModel = JSON.parse(data);
    return authors.includes(author) && state === NamespaceState.Run;
  }

  public async clearNamespace() {
    this.service.redis.del(this.namespaceMapName);
  }
}