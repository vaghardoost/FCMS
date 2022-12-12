import {
  Body,
  Controller,
  Delete,
  Get,
  Inject, OnModuleInit,
  Param,
  Patch,
  Post,
  Request,
  SetMetadata,
  UseGuards,
  ValidationPipe
} from "@nestjs/common";
import { UpdateCatDto } from "./dto/update-cat.dto";
import { CreateCatDto } from "./dto/create-cat.dto";
import { DeleteCatDto } from "./dto/delete-cat.dto";
import { ClientKafka } from "@nestjs/microservices";
import { AuthGuard } from "../../../module/auth/guard/auth.guard";
import { Role } from "../../../module/auth/auth.role";

@Controller('category')
export class CategoryController implements OnModuleInit{

  constructor(@Inject('kafka-client') private readonly kafka:ClientKafka) {}

  public onModuleInit() {
    this.kafka.subscribeToResponseOf("category");
    this.kafka.subscribeToResponseOf("category-refresh");
    this.kafka.subscribeToResponseOf("category-list");
    this.kafka.subscribeToResponseOf("category-update");
    this.kafka.subscribeToResponseOf("category-create");
    this.kafka.subscribeToResponseOf("category-delete");
  }

  @Patch("refresh")
  @UseGuards(AuthGuard)
  @SetMetadata('role',[Role.Manager,Role.Author])
  public async refresh(){
    return this.kafka.send('category-refresh',{});
  }

  @Get(":id")
  public async get(@Param('id') id:string){
    return this.kafka.send('category',{id:id});
  }

  @Get()
  public async list() {
    return this.kafka.send('category-list',{});
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  @SetMetadata('role',[Role.Manager,Role.Author])
  public async update(@Param('id') id:string,@Body(ValidationPipe) dto:UpdateCatDto){
    return this.kafka.send('category-update', { ...dto,id:id });
  }

  @Post()
  @UseGuards(AuthGuard)
  @SetMetadata('role',[Role.Manager,Role.Author])
  public async create(@Body(ValidationPipe) dto:CreateCatDto,@Request() request:any) {
    return this.kafka.send('category-create',{...dto,admin:request.user.id});
  }

  @Delete()
  @UseGuards(AuthGuard)
  @SetMetadata('role',[Role.Manager,Role.Author])
  public async delete(@Body(ValidationPipe) dto:DeleteCatDto,@Request() request:any){
    return this.kafka.send('category-delete',{...dto,user:request.user.id});
  }
}
