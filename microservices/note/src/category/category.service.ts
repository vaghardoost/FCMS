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
import { randomUUID } from 'crypto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('category') private readonly catModel: Model<CategoryModel>,
    private readonly redisService: RedisCategoryService,
    private readonly redisNote: RedisNoteService,
  ) {}

  async getCategory(id: string): Promise<Result<CategoryModel | undefined>> {
    const allNotes = await this.redisNote.getAllNotes();
    const cat = await this.redisService.getCategory(id);
    const result: CategoryModel = {
      ...cat,
      notes: [],
    };
    for (const note of allNotes) {
      if (note.category === id) {
        delete note.content;
        result.notes.push(note);
      }
    }
    return {
      code: Code.GetCategory,
      message: cat ? 'category founded' : 'category note founded',
      success: cat !== null,
      payload: cat ? result : undefined,
    };
  }

  async refreshRedis(): Promise<Result<any>> {
    const cats = await this.catModel.find<CategoryModel>({}, { _id: 0 });
    const catList = await this.redisService.refreshCategories(cats);
    return {
      code: Code.RefreshRedis,
      message: 'categories has been refreshed',
      success: true,
      payload: {
        categoryList: catList,
      },
    };
  }

  async update(dto: UpdateCatDto): Promise<Result<CategoryModel>> {
    try {
      const result = await this.catModel.findOneAndUpdate(
        { id: dto.id },
        { $set: dto },
      );
      if (result) {
        await this.redisService.updateCategory({ ...result.toJSON(), ...dto });
        return {
          code: Code.UpdateCategory,
          message: 'category has been updated',
          success: true,
          payload: { ...result.toJSON(), ...dto },
        };
      }
      return {
        code: Code.UpdateCategory,
        message: 'category update failed',
        success: false,
      };
    } catch {
      return ServiceError;
    }
  }

  async list(): Promise<Result<CategoryModel[]>> {
    const result = await this.redisService.getAllCategories();
    return {
      code: Code.ListCategory,
      message: 'list of categories',
      success: true,
      payload: result,
    };
  }

  async delete(dto: DeleteCatDto): Promise<Result<CategoryModel>> {
    try {
      const result = await this.catModel.findOneAndRemove({
        id: dto.id,
        user: dto.user,
      });
      if (result) {
        await this.redisService.deleteCategory(dto.id);
        return {
          code: Code.DeleteCategory,
          message: 'category deleted',
          success: true,
          payload: result,
        };
      }
      return {
        code: Code.DeleteCategory,
        message: 'category delete failed',
        success: false,
      };
    } catch {
      return ServiceError;
    }
  }

  async create(dto: CreateCatDto): Promise<Result<CategoryModel>> {
    try {
      const category: CategoryModel = { ...dto, id: randomUUID() };  
      const model = new this.catModel(category);
      const cat = await model.save();
      await this.redisService.addCategory(cat);
      
      return {
        code: Code.CreateCategory,
        message: 'category has ben created',
        success: true,
        payload: cat.toJSON(),
      };
    } catch {
      return ServiceError;
    }
  }
}
