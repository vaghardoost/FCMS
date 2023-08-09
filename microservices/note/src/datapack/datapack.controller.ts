import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { DatapackService } from "./datapack.service";
import DatapackCreateDto from "./dto/datapack.create.dto";
import DatapackNamespaceDto from "./dto/datapack.namespace.dto";
import DatapackUpdateDto from "./dto/datapack.update.dto";
import DatapackDeleteDto from "./dto/datapack.delete.dto";
import DatapackGetDto from "./dto/datapack.get.dto";
import DatapackSearchDto from "./dto/datapack.search.dto";

@Controller('datapack')
export default class DatapackController {

  constructor(private readonly service: DatapackService) { }

  @MessagePattern('datapack.create')
  public create(@Payload() dto: DatapackCreateDto) {
    return this.service.create(dto);
  }

  @MessagePattern('datapack.namespace')
  public namespace(@Payload() dto: DatapackNamespaceDto) {
    return this.service.namespace(dto);
  }

  @MessagePattern('datapack.list')
  public list() {
    return this.service.list()
  }

  @MessagePattern('datapack.get')
  public get(@Payload() dto: DatapackGetDto) {
    return this.service.get(dto);
  }

  @MessagePattern('datapack.update')
  public update(@Payload() dto: DatapackUpdateDto) {
    return this.service.update(dto);
  }

  @MessagePattern('datapack.delete')
  public delete(@Payload() dto: DatapackDeleteDto) {
    return this.service.delete(dto);
  }

  @MessagePattern('datapack.reload')
  public reload() {
    return this.service.reload();
  }

  @MessagePattern('datapack.search')
  public search(@Payload() dto: DatapackSearchDto) {
    return this.service.search(dto);
  }
}