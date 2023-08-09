import { Injectable } from "@nestjs/common";
import { Model } from 'mongoose';
import { InjectModel } from "@nestjs/mongoose";

import DatapackCreateDto from "./dto/datapack.create.dto";
import DatapackNamespaceDto from "./dto/datapack.namespace.dto";
import DatapackUpdateDto from "./dto/datapack.update.dto";
import DatapackDeleteDto from "./dto/datapack.delete.dto";
import { RedisDatapackService } from "src/redis/datapack.redis.service";
import DatapackGetDto from "./dto/datapack.get.dto";
import { Code, Result } from "src/app.result";
import DatapackModel from "./datapack.model";
import DatapackSearchDto from "./dto/datapack.search.dto";

@Injectable()
export class DatapackService {

  constructor(
    private readonly redis: RedisDatapackService,
    @InjectModel('datapack') private readonly model: Model<DatapackModel>,
  ) { }

  public async reload() {
    await this.redis.clear();
    const result = await this.model.find<DatapackModel>().lean();
    result.forEach(item => {
      const datapack = { ...item, id: item._id.toString() };
      delete datapack._id;
      delete datapack.content;
      delete datapack.env;
      this.redis.setDatapack(datapack.id, datapack);
    })
    return this.successResult(Code.RefreshRedis, 'datapack redis hasbeen reloaded');
  }

  public async get(dto: DatapackGetDto) {
    const result = await this.redis.getCache(dto.id);
    if (result) {
      return this.successResult(Code.GetDatapack, 'get datapack', JSON.parse(result));
    }
    const mongoResult = await this.model.findById<DatapackModel>({ _id: dto.id }).lean();
    if (mongoResult) {
      const datapack = { ...mongoResult, id: dto.id };
      await this.redis.cacheDatapack(dto.id.toString(), datapack);
      return this.successResult(Code.GetDatapack, 'get datapack', datapack);
    }
    return this.faildResult(Code.GetDatapack, 'datapack not found');
  }

  public async namespace(dto: DatapackNamespaceDto) {
    const result = [];
    const list = await this.redis.all();
    for (const key in list) {
      const item: DatapackModel = JSON.parse(list[key]);
      if (item.namespace === dto.namespace) {
        delete item.env;
        delete item.content;
        result.push(item)
      }
    }
    return this.successResult(Code.NamespaceDatapack, 'datapack of namespace', result);
  }

  public async update(dto: DatapackUpdateDto) {
    const result = await this.model.findOneAndUpdate(
      { _id: dto.id, namespace: dto.namespace },
      { $set: { ...dto } },
      { new: true }
    ).lean();
    if (result) {
      const datapack = { id: result._id.toString(), ...result };
      delete datapack._id;

      this.redis.cacheDatapack(datapack.id, datapack);
      delete datapack.content;
      delete datapack.env;
      this.redis.setDatapack(datapack.id, datapack);

      return this.successResult(Code.UpdateDatapack, 'datapack has been updated', datapack);
    }
    return this.faildResult(Code.UpdateDatapack, 'datapack not found');
  }

  public async create(dto: DatapackCreateDto) {
    const model = new this.model(dto);
    const result = await model.save();
    const datapack = { id: result._id.toString(), ...dto };
    this.redis.cacheDatapack(datapack.id, datapack);
    delete datapack.content;
    delete datapack.env;
    this.redis.setDatapack(datapack.id, datapack);
    return this.successResult(Code.CreateDatapack, 'datapack save successful', datapack);
  }

  public async list() {
    const result = [];
    const list = await this.redis.all();
    for (const key in list) {
      const item: DatapackModel = JSON.parse(list[key]);
      delete item.env;
      delete item.content;
      result.push(item);
    }
    return this.successResult(Code.DatapackList, 'list of all datapack', result);
  }

  public async delete(dto: DatapackDeleteDto) {
    const result = await this.model.findOneAndDelete({ _id: dto.id, namespace: dto.namespace }).lean()
    if (result) {
      this.redis.deleteDatapack(dto.id);
      return this.successResult(Code.DeleteDatapack, 'delete datapack success')
    }
    return this.faildResult(Code.DeleteDatapack, 'delete datapack faile')
  }

  public async search(dto: DatapackSearchDto) {
    const result: DatapackModel[] = [];
    const list = await this.redis.all();
    for (const key in list) {
      const item: DatapackModel = JSON.parse(list[key]);
      if (item.namespace === dto.namespace && item.title.includes(dto.title)) {
        result.push(item);
      }
    }
    return this.successResult(Code.Search, `search result by ${dto.title}`, result);
  }

  private successResult(code: number, message: string, payload?: any): Result<any> {
    return {
      code: code,
      message: message,
      success: true,
      payload: payload
    }
  }

  private faildResult(code: number, message: string): Result<any> {
    return {
      code: code,
      message: message,
      success: false
    }
  }
}