import { Controller, OnModuleInit } from "@nestjs/common"
import { MessagePattern, Payload } from "@nestjs/microservices"
import ThemeService from "./theme.service"
import ThemeInsertDto from "./dto/theme.insert.dto"
import ThemeUpdateDto from "./dto/theme.update.dto"
import ThemeInquiryDto from "./dto/theme.inquiry.dto"


@Controller()
export default class ThemeController {

  constructor(private readonly service: ThemeService) { }

  @MessagePattern('theme.reload')
  public async reload() {
    return this.service.reload()
  }

  @MessagePattern('theme.list')
  public async list() {
    return this.service.list()
  }

  @MessagePattern('theme.insert')
  public async insert(@Payload() dto: ThemeInsertDto) {
    return this.service.insert(dto)
  }

  @MessagePattern('theme.update')
  public async update(@Payload() dto: ThemeUpdateDto) {
    return this.service.update(dto)
  }

  @MessagePattern('theme.inquiry')
  public async inquiry(@Payload() dto: ThemeInquiryDto) {
    return this.service.inquiry(dto)
  }

}
