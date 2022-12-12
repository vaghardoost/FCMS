import { Body, Controller, Inject, OnModuleInit, Post, SetMetadata, UseGuards, ValidationPipe } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { CreateAdminDto } from "./dto/admin.create.dto";
import { Role } from "../../module/auth/auth.role";
import { AuthGuard } from "../../module/auth/guard/auth.guard";
import { AuthDto } from "../../module/auth/auth.dto";

@Controller('admin')
export class AdminController implements OnModuleInit{
  constructor(@Inject('kafka-client') private kafka:ClientKafka) {}

  async onModuleInit() {
    this.kafka.subscribeToResponseOf('admin.create');
    this.kafka.subscribeToResponseOf('admin.setup');
  }

  @Post('create')
  @UseGuards(AuthGuard)
  @SetMetadata('role',[Role.Manager])
  public create(@Body(ValidationPipe) dto:CreateAdminDto){
    return this.kafka.send('admin.create',dto);
  }

  @Post('setup')
  public setup(@Body(ValidationPipe) dto:AuthDto){
    return this.kafka.send('admin.setup',JSON.stringify(dto));
  }

}