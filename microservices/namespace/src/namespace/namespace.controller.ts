import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import NamespaceCreateDto from './dto/namespace.create.dto';
import NamespaceInquiryDto from './dto/namespace.inquiry.dto';
import NamespaceAuthorDto from './dto/namespace.author.dto';
import NamespaceStateDto from './dto/namespace.state.dto';
import NamespaceUpdateDto from './dto/namespace.update.dto';
import NamespaceService from './namespace.service';
import NamespaceIncludeDto from './dto/namespace.include.dto';
import NamespaceThemeDto from './dto/namespace.theme.dto';
import NamespaceSpecialSetDto from './dto/namespace.special.set.dto';
import NamespaceSpecialGetDto from './dto/namespace.special.get.dto';

@Controller()
export default class NamespaceController {

  constructor(private readonly service: NamespaceService) { }

  @MessagePattern('namespace.inquiry')
  public inquiry(@Payload() dto: NamespaceInquiryDto) {
    return this.service.inquiry(dto);
  }

  @MessagePattern('namespace.create')
  public register(@Payload() dto: NamespaceCreateDto) {
    return this.service.create(dto)
  }

  @MessagePattern('namespace.state')
  public setState(@Payload() dto: NamespaceStateDto) {
    return this.service.setState(dto);
  }

  @MessagePattern('namespace.include')
  public setInclude(@Payload() dto: NamespaceIncludeDto) {
    return this.service.setInclude(dto);
  }

  @MessagePattern('namespace.reload')
  public reload() {
    return this.service.reload()
  }

  @MessagePattern('namespace.update')
  public update(@Payload() dto: NamespaceUpdateDto) {
    return this.service.update(dto)
  }

  @MessagePattern('namespace.push')
  public push(@Payload() dto: NamespaceAuthorDto) {
    return this.service.push(dto)
  }

  @MessagePattern('namespace.pull')
  public authorRemove(@Payload() dto: NamespaceAuthorDto) {
    return this.service.pull(dto)
  }

  @MessagePattern('namespace.get')
  public get(@Payload() dto: { id: string }) {
    return this.service.get(dto);
  }

  @MessagePattern('namespace.theme')
  public theme(@Payload() dto: NamespaceThemeDto) {
    return this.service.theme(dto);
  }

  @MessagePattern('namespace.list')
  public list() {
    return this.service.list();
  }

  @MessagePattern('namespace.special.set')
  public setSpecial(@Payload() dto: NamespaceSpecialSetDto) {
    return this.service.setSpecial(dto);
  }

  @MessagePattern('namespace.special.get')
  public getSpecial(@Payload() dto: NamespaceSpecialGetDto) {
    return this.service.getSpecial(dto);
  }
}
