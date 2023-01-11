import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CategoryService } from './category.service';
import { CreateCatDto } from './dto/create.cat.dto';
import { DeleteCatDto } from './dto/delete.cat.dto';
import { UpdateCatDto } from './dto/update.cat.dto';

@Controller()
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @MessagePattern('category-refresh')
  public refresh() {
    return this.service.refreshRedis();
  }

  @MessagePattern('category')
  public get(@Payload() dto: { id: string }) {
    return this.service.getCategory(dto.id);
  }

  @MessagePattern('category-update')
  public update(@Payload() dto: UpdateCatDto) {
    return this.service.update(dto);
  }

  @MessagePattern('category-delete')
  public delete(dto: DeleteCatDto) {
    return this.service.delete(dto);
  }

  @MessagePattern('category-create')
  public create(@Payload() dto: CreateCatDto) {
    return this.service.create(dto);
  }

  @MessagePattern('category-list')
  public list() {
    return this.service.list();
  }
}
