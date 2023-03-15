import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { AuthDto } from "./auth.dto";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) { }

  @Post()
  public admin(@Body(ValidationPipe) dto: AuthDto) {
    return this.service.auth(dto);
  }

}
