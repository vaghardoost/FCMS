import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import NamespaceCreateDto from "./dto/namespace.create.dto";
import NamespaceModel from "./namespace.model";
import { NamespaceState } from "./namespace.state";
import { Code, HeaderCode, MicroserviceRes, Result } from "src/app.result";
import NamespaceStateDto from "./dto/namespace.state.dto";
import NamespaceUpdateDto from "./dto/namespace.update.dto";
import NamespaceAuthorDto from "./dto/namespace.author.dto";
import { NamespaceInquiryDto } from "./dto/namespace.inquiry.dto";
import RedisNamespaceService from "src/redis/redis.service.namespace";

@Injectable()
export default class NamespaceService implements OnModuleInit {
  constructor(
    @InjectModel('Namespace') private namespaceModel: Model<NamespaceModel>,
    private readonly redis: RedisNamespaceService
  ) { }

  async onModuleInit() { await this.reload() }

  public async get({ id }: { id: string }) {
    const list = await this.redis.allNamespaces();
    const result = [];

    for (const key in list) {
      const item: NamespaceModel = JSON.parse(list[key]);
      if (item.authors.includes(id)) {
        result.push({ ...item, id: key });
      }
    }
    return this.successResult(Code.Namespace, result);
  }

  public async pull({ author, id }: NamespaceAuthorDto) {
    const result = await this.namespaceModel.findOneAndUpdate<NamespaceModel>({ _id: id }, { $pull: { authors: author } }, { new: true }).lean();
    this.redis.setNamespace(id, result);
    return this.successResult(Code.Pull, result);
  }

  public async push({ author, id }: NamespaceAuthorDto) {
    const result = await this.namespaceModel.findOneAndUpdate<NamespaceModel>({ _id: id }, { $addToSet: { authors: author } }, { new: true }).lean();
    this.redis.setNamespace(id, result);
    return this.successResult(Code.Push, result);
  }

  public async update(dto: NamespaceUpdateDto) {
    const namesapce = await this.redis.getNamespace(dto.id);
    await this.namespaceModel.findOneAndUpdate<NamespaceModel>({ _id: dto.id }, { $set: { ...dto } }, { new: true }).lean();
    const new_namespace = { ...namesapce, ...dto };
    this.redis.setNamespace(dto.id, new_namespace);
    return this.successResult(Code.UpdateNamespace);
  }

  public async create(dto: NamespaceCreateDto) {
    const nsmodel: NamespaceModel = {
      ...dto,
      founder: dto.admin,
      primaryColor: '#000000',
      secoundColor: '#FFFFFF',
      authors: [dto.admin],
      state: NamespaceState.Suspend,
    }
    const model = new this.namespaceModel<NamespaceModel>(nsmodel);
    const { _id } = await model.save();
    this.redis.setNamespace(_id.toString(), nsmodel);
    return this.successResult(Code.Register, nsmodel);
  }

  public async setState({ id, state }: NamespaceStateDto) {
    const result = await this.namespaceModel.findOneAndUpdate<NamespaceModel>({ _id: id }, { $set: { state: state } }, { new: true }).lean();
    this.redis.setNamespace(id, result);
    return this.successResult(Code.State, result);
  }

  public async reload() {
    const result = await this.namespaceModel.find<NamespaceModel>({}).lean();
    this.redis.clearNamespace();
    for (const item of result) {
      const _id = item._id;
      this.redis.setNamespace(_id.toString(), item);
    }
    return this.successResult(Code.Reload);
  }

  public async inquiry({ id, author }: NamespaceInquiryDto): Promise<MicroserviceRes<any>> {
    const success = (await this.redis.existNamespace(id, author))
    return {
      header: {
        code: (success) ? HeaderCode.SUCCESS : HeaderCode.NOT_EXISTS,
      },
      response: {
        code: Code.Inquiry,
        success: success
      }
    }
  }

  private successResult(code: number, payload?: any): Result<any> {
    return {
      code: code,
      success: true,
      payload: payload
    }
  }

  private faildResult(code: number): Result<any> {
    return {
      code: code,
      success: false
    }
  }
}
