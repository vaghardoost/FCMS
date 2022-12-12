import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./auth.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly service:AuthService) {}

  @Post('admin')
  public admin(@Body(ValidationPipe) dto:AuthDto){
    return this.service.admin(dto);
  }

}
