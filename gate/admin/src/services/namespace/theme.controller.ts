import { Param, Get, Inject, Body, Controller, Put, SetMetadata, UseGuards, ValidationPipe, OnModuleInit, Post } from "@nestjs/common";
import { Role } from "src/app.roles";
import { AuthGuard } from "src/auth/auth.guard";
import InsertThemeDto from "./dto/theme.insert.dto";
import { ClientKafka } from "@nestjs/microservices";
import UpdateThemeDto from "./dto/theme.update.dto";
import { ValidationPipeId } from "../services.pipe";
import ThemeGuard from "./guards/theme.guard";

@Controller('theme')
export default class ThemeController implements OnModuleInit {

  constructor(@Inject("kafka-client") private readonly client: ClientKafka) { }

  onModuleInit() {
    this.client.subscribeToResponseOf('theme.insert');
    this.client.subscribeToResponseOf('theme.update');
    this.client.subscribeToResponseOf('theme.list');
    this.client.subscribeToResponseOf('theme.reload');
  }

  @Put()
  @UseGuards(AuthGuard)
  @SetMetadata("role", [Role.Operator, Role.Manager])
  async insert(@Body(ValidationPipe) dto: InsertThemeDto) {
    return this.client.send('theme.insert', dto);
  }

  @Get()
  async list() {
    return this.client.send('theme.list', {});
  }

  @Post('reload')
  @UseGuards(AuthGuard)
  @SetMetadata("role", [Role.Operator, Role.Manager])
  async reload() {
    return this.client.send('theme.reload', {});
  }

  @Post(':id')
  @UseGuards(AuthGuard, ThemeGuard)
  @SetMetadata("role", [Role.Operator, Role.Manager])
  async update(@Body(ValidationPipe) dto: UpdateThemeDto, @Param('id', ValidationPipeId) id: string) {
    return this.client.send('theme.update', { ...dto, id: id });
  }
}
