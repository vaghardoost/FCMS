import { Controller, Patch, Post, SetMetadata, UseGuards, Inject, Body, ValidationPipe, OnModuleInit } from "@nestjs/common";
import { Role } from "../../app.roles";
import { ClientKafka } from "@nestjs/microservices";
import { AuthGuard } from "src/guard/auth.guard";
import { AdminCreateDto } from "./dto/admin.create.dto";
import { AdminDto } from "./dto/admin.dto";

@Controller("admin")
export class AdminController implements OnModuleInit {

  constructor(@Inject("kafka-client") private readonly client: ClientKafka) { }

  onModuleInit() {
    this.client.subscribeToResponseOf('admin.reload');
    this.client.subscribeToResponseOf('admin.create');
    this.client.subscribeToResponseOf('admin.setup');
  }

  @Patch("refresh")
  @UseGuards(AuthGuard)
  @SetMetadata("role", [Role.Manager, Role.Author])
  public reload() {
    return this.client.send("admin.reload", {});
  }

  @Post("setup")
  public setup(@Body(ValidationPipe) dto: AdminDto) {
    return this.client.send("admin.setup", dto);
  }

  @Post()
  @UseGuards(AuthGuard)
  @SetMetadata("role", [Role.Manager])
  public create(@Body(ValidationPipe) dto: AdminCreateDto) {
    return this.client.send("admin.create", dto);
  }
}
