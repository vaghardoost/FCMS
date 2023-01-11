import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { RedisModule } from '../redis/redis.module';
import { CategorySchema } from './category.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [
    RedisModule,
    MongooseModule.forFeature([{ name: 'category', schema: CategorySchema }]),
  ],
})
export class CategoryModule {}
