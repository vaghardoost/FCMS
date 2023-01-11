import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigService } from '../config/config.service';
import { CategoryModel } from '../category/category.model';

@Injectable()
export class RedisCategoryService {
  private readonly categoryRedisName =
    this.configService.config.name + '_category';

  constructor(
    private connection: RedisService,
    private readonly configService: ConfigService,
  ) {}

  public async refreshCategories(
    categories: CategoryModel[],
  ): Promise<number[]> {
    await this.connection.redis.del(this.categoryRedisName);
    const result: number[] = [];
    for (const cat of categories) {
      const res = await this.setCategory(cat);
      result.push(res);
    }
    return result;
  }

  public async updateCategory(categoryModel: CategoryModel) {
    const cat = await this.getCategory(categoryModel.id);
    const updated = { ...cat, ...categoryModel };
    return this.setCategory(updated);
  }

  public async getCategory(id: string): Promise<CategoryModel> {
    const raw = await this.connection.redis.hget(this.categoryRedisName, id);
    return JSON.parse(raw);
  }

  public async getAllCategories(): Promise<CategoryModel[]> {
    const result: CategoryModel[] = [];
    const data = await this.connection.redis.hgetall(this.categoryRedisName);
    for (const key in data) {
      result.push(JSON.parse(data[key]));
    }
    return result;
  }

  public async deleteCategory(id: string) {
    return this.connection.redis.hdel(this.categoryRedisName, id);
  }

  public async setCategory(category: CategoryModel) {
    return this.connection.redis.hset(this.categoryRedisName, {
      [category.id]: JSON.stringify(category),
    });
  }

  public async addCategory(category: CategoryModel) {
    return this.connection.redis.hset(this.categoryRedisName, {
      [category.id]: JSON.stringify(category),
    });
  }

  public async getCategoryList(): Promise<CategoryModel[]> {
    const resultRaw = await this.connection.redis.hgetall(
      this.categoryRedisName,
    );
    const result = [];
    for (const id in resultRaw) {
      const cat: CategoryModel = JSON.parse(resultRaw[id]);
      result.push(cat);
    }
    return result;
  }
}
