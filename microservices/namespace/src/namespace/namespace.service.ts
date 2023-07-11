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
import NamespaceInquiryDto from "./dto/namespace.inquiry.dto";
import RedisNamespaceService from "src/redis/redis.service.namespace";
import NamespaceIncludeDto from "./dto/namespace.include.dto";
import { NamespaceType } from "./namespace.enum";
import NamespaceThemeDto from "./dto/namespace.theme.dto";
import NamespaceSpecialGetDto from "./dto/namespace.special.get.dto";
import NamespaceSpecialSetDto from "./dto/namespace.special.set.dto";
import NamespaceSpecialModel from "./namespace.special.model";

@Injectable()
export default class NamespaceService implements OnModuleInit {

  constructor(
    @InjectModel('Namespace') private namespaceModel: Model<NamespaceModel>,
    @InjectModel('NamespaceSpecial') private namespaceSpecialModel: Model<NamespaceSpecialModel>,
    private readonly redis: RedisNamespaceService
  ) { }

  async onModuleInit() { await this.reload() }

  public async setInclude(dto: NamespaceIncludeDto) {
    const result = await this.namespaceModel.findOneAndUpdate<NamespaceModel>({ _id: dto.id }, { $set: { ...dto } }, { new: true }).lean();
    this.redis.setNamespace(dto.id, result);
    return this.successResult(Code.NamespaceInclude);
  }

  public async get({ id }: { id: string }) {
    const list = await this.redis.allNamespaces();
    const result = [];
    for (const key in list) {
      const item: NamespaceModel = JSON.parse(list[key]);
      if (item.authors.includes(id)) {
        result.push({ ...item, id: key });
      }
    }
    return this.successResult(Code.GetNamespace, result);
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
      include: [NamespaceType.Blog],
    }
    const model = new this.namespaceModel<NamespaceModel>(nsmodel);
    const { _id } = await model.save();
    this.redis.setNamespace(_id.toString(), nsmodel);
    return this.successResult(Code.RegisterNamespace, nsmodel);
  }

  public async setState({ id, state }: NamespaceStateDto) {
    const result = await this.namespaceModel.findOneAndUpdate<NamespaceModel>({ _id: id }, { $set: { state: state } }, { new: true }).lean();
    this.redis.setNamespace(id, result);
    return this.successResult(Code.StateNamespace, result);
  }

  public async reload() {
    const result = await this.namespaceModel.find<NamespaceModel>({}).lean();
    await this.redis.clearNamespace();
    for (const item of result) {
      const _id = item._id;
      this.redis.setNamespace(_id.toString(), item);
    }

    const sResult = await this.namespaceSpecialModel.find({}).lean();
    for (const item of sResult) {
      const { id, name } = item;
      this.redis.setSpecial(name, id);
    }

    return this.successResult(Code.Reload);
  }

  public async list() {
    const list = await this.redis.allNamespaces();
    const result = []
    for (const id in list) {
      const item = { id: id, ...JSON.parse(list[id]) };
      result.push(item);
    }
    return this.successResult(Code.NamespaceList, result);
  }

  public async theme({ id, theme }: NamespaceThemeDto) {
    this.namespaceModel.findOneAndUpdate({ _id: id }, { $set: { theme: theme } });
    const namesapce = await this.redis.getNamespace(id);
    const new_namespace = { ...namesapce, theme: theme };
    this.redis.setNamespace(id, new_namespace);
    return this.successResult(Code.NamespaceTheme, new_namespace);
  }

  public async getSpecial(dto: NamespaceSpecialGetDto) {
    const result = await this.redis.getSpecial(dto.name);
    return (result)
      ? this.successResult(Code.GetSpecial, result)
      : this.faildResult(Code.GetSpecial);
  }

  public async setSpecial(dto: NamespaceSpecialSetDto) {
    await this.namespaceSpecialModel.updateOne(
      { name: dto.name },
      { $set: { id: dto.id } },
      { upsert: true }
    );
    await this.redis.setSpecial(dto.name, dto.id);
    return this.successResult(Code.SetSpecial);
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
