import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCatDto } from './dto/category.create.dto';
import { FindCatDto } from './dto/category.find.dto';
import { UpdateCatDto } from './dto/category.update.dto';
import { CategoryModel } from './category.model';
import { RedisCategoryService } from '../redis/category.redis.service';
import { RedisNoteService } from '../redis/note.redis.service';
import { Code, Result, ServiceError } from '../app.result';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('category') private readonly catModel: Model<CategoryModel>,
    private readonly redisService: RedisCategoryService,
    private readonly redisNote: RedisNoteService,
  ) { }

  async getCategory({ id, namespace }: FindCatDto): Promise<Result<CategoryModel | undefined>> {
    const allNotes = await this.redisNote.getAllNotes(namespace);
    const cat = await this.redisService.getCategory(id, namespace);
    if (cat) {
      const result: CategoryModel = { ...cat, notes: [] };
      for (const note of allNotes) {
        if (note.category === id) {
          delete note.content;
          result.notes.push(note);
        }
      }
      return this.successResult(Code.GetCategory, 'category data', result);
    }
    return this.faildResult(Code.GetCategory, 'category not founds')
  }

  async refreshRedis(): Promise<Result<any>> {
    const cats = await this.catModel.find<CategoryModel>({}).lean();
    await this.redisService.refresh(cats);
    return this.successResult(Code.RefreshRedis, 'system refresh successful')
  }

  async update(dto: UpdateCatDto): Promise<Result<CategoryModel>> {
    try {
      const result = await this.catModel.findOneAndUpdate<CategoryModel>({ _id: dto.id, namespace: dto.namespace }, dto, { new: true }).lean();
      if (result) {
        const updatedResult: CategoryModel = { ...result, ...dto }
        await this.redisService.setCategory(dto.id, updatedResult);
        return this.successResult(Code.UpdateCategory, 'update category successful', updatedResult);
      }
      return this.faildResult(Code.UpdateCategory, 'update category failed')
    } catch (error) {
      console.error('internal error', error);
      return ServiceError;
    }
  }

  async list({ namespace }: { namespace: string }): Promise<Result<CategoryModel[]>> {
    const result = await this.redisService.getAllCategories(namespace);
    return this.successResult(Code.ListCategory, 'list of categories', result);
  }

  async delete({ id, namespace }: FindCatDto): Promise<Result<CategoryModel>> {
    try {
      const result = await this.catModel.findOneAndRemove({
        _id: id,
        namespace: namespace
      });
      if (result) {
        await this.redisService.deleteCategory(id);
        return this.successResult(Code.DeleteCategory, 'category delete successful')
      }
      return this.faildResult(Code.DeleteCategory, 'category delete failed');
    } catch (error) {
      console.error('internal error', error);
      return ServiceError;
    }
  }

  async create(dto: CreateCatDto): Promise<Result<CategoryModel>> {
    try {
      const category: CategoryModel = { ...dto };
      const model = new this.catModel(category);
      const cat = await model.save();
      await this.redisService.addCategory({ ...category, id: cat._id });
      return this.successResult(Code.CreateCategory, 'new category', { ...category, id: cat._id })
    } catch (error) {
      console.error('internal error', error);
      return ServiceError;
    }
  }

  private successResult(code: number, message?: string, payload?: any): Result<any> {
    return {
      code: code,
      success: true,
      message: message,
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
