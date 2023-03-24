import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';
import { CategoryModel } from '../category/category.model';
import { ConfigService } from "@nestjs/config"

@Injectable()
export class RedisCategoryService {
  private readonly categoryRedisName = `${this.configService.get<string>('NAME')}.category`;

  constructor(
    private readonly connection: RedisService,
    private readonly configService: ConfigService,
  ) { }

  public async refresh(categories: CategoryModel[]) {
    await this.connection.redis.del(this.categoryRedisName);
    for (const cat of categories) {
      const _id = cat._id;
      delete cat._id;
      await this.setCategory(_id, cat);
    }
  }

  public async addOrUpdate(id: string, categoryModel: CategoryModel) {
    const cat = await this.getCategory(id);
    const updated = { ...cat, ...categoryModel };
    return this.setCategory(id, updated);
  }

  public async getCategory(id: string): Promise<CategoryModel> {
    const raw = await this.connection.redis.hget(this.categoryRedisName, id);
    return JSON.parse(raw);
  }

  public async getAllCategories(): Promise<CategoryModel[]> {
    const result: CategoryModel[] = [];
    const data = await this.connection.redis.hgetall(this.categoryRedisName);
    for (const id in data) {
      result.push({ ...JSON.parse(data[id]), id: id });
    }
    return result;
  }

  public async deleteCategory(id: string) {
    return this.connection.redis.hdel(this.categoryRedisName, id);
  }

  public async setCategory(id: string, category: CategoryModel) {
    return this.connection.redis.hset(this.categoryRedisName, {
      [id]: JSON.stringify(category),
    });
  }

  public async addCategory(category: CategoryModel) {
    this.connection.redis.hset(this.categoryRedisName, { [category.id]: JSON.stringify(category) });
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
