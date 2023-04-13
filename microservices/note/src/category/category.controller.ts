import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CategoryService } from './category.service';
import { CreateCatDto } from './dto/category.create.dto';
import { FindCatDto } from './dto/category.find.dto';
import { UpdateCatDto } from './dto/category.update.dto';

@Controller()
export class CategoryController {
  constructor(private readonly service: CategoryService) { }

  @MessagePattern('category.refresh')
  public refresh() {
    return this.service.refreshRedis();
  }

  @MessagePattern('category.get')
  public get(@Payload() dto: FindCatDto) {
    return this.service.getCategory(dto);
  }

  @MessagePattern('category.update')
  public update(@Payload() dto: UpdateCatDto) {
    return this.service.update(dto);
  }

  @MessagePattern('category.delete')
  public delete(dto: FindCatDto) {
    return this.service.delete(dto);
  }

  @MessagePattern('category.create')
  public create(@Payload() dto: CreateCatDto) {
    return this.service.create(dto);
  }

  @MessagePattern('category.list')
  public list(@Payload() dto: { namespace: string }) {
    return this.service.list(dto);
  }
}
