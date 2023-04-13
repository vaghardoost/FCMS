import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AdminService } from './admin.service';
import { AdminDto } from './dto/admin.dto';
import { AdminCreateDto } from './dto/admin.create.dto';
import { AdminInquiryDto } from './dto/admin.inquiry.dto';

@Controller()
export class AdminController {
  constructor(private readonly service: AdminService) { }

  @MessagePattern('admin.inquiry')
  public inquiry(@Payload() dto: AdminInquiryDto) {
    return this.service.inquiry(dto);
  }

  @MessagePattern('admin.reload')
  public reload() {
    return this.service.reload();
  }

  @MessagePattern('admin.setup')
  public setup(@Payload() dto: AdminDto) {
    return this.service.setup(dto);
  }

  @MessagePattern('admin.create')
  public create(@Payload() dto: AdminCreateDto) {
    return this.service.create(dto);
  }

  @MessagePattern('admin.list')
  public list() {
    return this.service.list();
  }

}
