import { Injectable } from "@nestjs/common"
import RedisThemeService from "src/redis/redis.service.theme";
import ThemeDto from "./dto/theme.insert.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import ThemeInsertModel from "./theme.model";
import ThemeModel from "./theme.model";
import ThemeUpdateDto from "./dto/theme.update.dto";
import ThemeInquiryDto from "./dto/theme.inquiry.dto";
import { Code, HeaderCode, Result } from "src/app.result";

@Injectable()
export default class ThemeService {

  constructor(
    private readonly redis: RedisThemeService,
    @InjectModel('theme') private themeModel: Model<ThemeModel>
  ) { }

  public async insert(dto: ThemeDto) {
    const model = new this.themeModel(dto);
    const { _id } = await model.save();
    const theme: ThemeInsertModel = { id: _id.toString(), ...dto }
    this.redis.setTheme(theme);
    return this.successResult(Code.InsertTheme, theme)
  }

  public async update(dto: ThemeUpdateDto) {
    this.themeModel.findOneAndUpdate<ThemeModel>({ _id: dto.id }, { $set: { ...dto } }).lean();
    const theme = await this.redis.getTheme(dto.id);
    const new_theme = { ...theme, ...dto }
    this.redis.setTheme(new_theme);
    return this.successResult(Code.UpdateTheme, new_theme);
  }

  public async list() {
    const list = [];
    const result = await this.redis.getAll();
    for (const id in result) {
      const model = JSON.parse(result[id]) as ThemeModel;
      list.push({ id: id, ...model });
    }
    return this.successResult(Code.ThemeList, list);
  }

  public async reload() {
    await this.redis.clear();
    const result = await this.themeModel.find<ThemeModel>({}).lean();
    result.forEach((doc) => {
      this.redis.setTheme(doc);
    })
    return this.successResult(Code.Reload);
  }

  public async inquiry({ id }: ThemeInquiryDto) {
    const success = (await this.redis.exists(id))
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