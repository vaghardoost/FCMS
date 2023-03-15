import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';

@Controller()
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @MessagePattern('admin.auth')
  public auth(@Payload() dto: AuthDto) {
    return this.service.auth(dto);
  }
}
