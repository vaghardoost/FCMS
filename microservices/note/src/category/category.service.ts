import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCatDto } from './dto/create.cat.dto';
import { DeleteCatDto } from './dto/delete.cat.dto';
import { UpdateCatDto } from './dto/update.cat.dto';
import { CategoryModel } from './category.model';
import { RedisCategoryService } from '../redis/redis.service.cat';
import { RedisNoteService } from '../redis/redis.service.note.';
import { Code, Result, ServiceError } from '../app.result';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('category') private readonly catModel: Model<CategoryModel>,
    private readonly redisService: RedisCategoryService,
    private readonly redisNote: RedisNoteService,
  ) { }

  async getCategory(id: string): Promise<Result<CategoryModel | undefined>> {
    const allNotes = await this.redisNote.getAllNotes();
    const cat = await this.redisService.getCategory(id);
    if (cat) {
      const result: CategoryModel = { ...cat, notes: [] };
      for (const note of allNotes) {
        if (note.category === id) {
          delete note.content;
          result.notes.push(note);
        }
      }
      return this.successResult(Code.GetCategory, 'category founded', result);
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
      const result: CategoryModel = await this.catModel.findOneAndUpdate<CategoryModel>({ _id: dto.id }, dto, { projection: { _id: 0 } }).lean();
      if (result) {
        const updatedResult: CategoryModel = { ...result, ...dto }
        await this.redisService.addOrUpdate(dto.id, updatedResult);
        return this.successResult(Code.UpdateCategory, 'update category successful', updatedResult);
      }
      return this.faildResult(Code.UpdateCategory, 'update category failed')
    } catch (error) {
      console.error('internal error', error);
      return ServiceError;
    }
  }

  async list(): Promise<Result<CategoryModel[]>> {
    const result = await this.redisService.getAllCategories();
    return this.successResult(Code.ListCategory, 'list of categories', result);
  }

  async delete(dto: DeleteCatDto): Promise<Result<CategoryModel>> {
    try {
      const result = await this.catModel.findOneAndRemove({
        _id: dto.id,
        author: dto.author,
      });
      if (result) {
        await this.redisService.deleteCategory(dto.id);
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
