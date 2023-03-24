import { Request, Controller, Get, Patch, Post, SetMetadata, UseGuards, Inject, Body, ValidationPipe, OnModuleInit, Param, Req } from "@nestjs/common";
import { Role } from "../../app.roles";
import { ClientKafka, Payload } from "@nestjs/microservices";
import { AuthGuard } from "src/auth/auth.guard";
import { AdminCreateDto } from "./dto/admin.create.dto";
import { AdminAuthDto } from "./dto/admin.auth.dto";
import NamespaceAuthorDto from "../namespace/dto/namespace.author.dto";
import { AdminInquiryDto } from "./dto/admin.inquiry.dto";

@Controller("admin")
export class AdminController implements OnModuleInit {

  constructor(@Inject("kafka-client") private readonly client: ClientKafka) { }

  onModuleInit() {
    this.client.subscribeToResponseOf("admin.reload");
    this.client.subscribeToResponseOf("admin.create");
    this.client.subscribeToResponseOf("admin.setup");
    this.client.subscribeToResponseOf("admin.getme");
    this.client.subscribeToResponseOf('admin.inquiry');
  }

  @Patch("reload")
  @UseGuards(AuthGuard)
  @SetMetadata("role", [Role.Manager, Role.Operator])
  public reload() {
    return this.client.send("admin.reload", {});
  }

  @Post("setup")
  public setup(@Body(ValidationPipe) dto: AdminAuthDto) {
    return this.client.send("admin.setup", dto);
  }

  @Get("inquiry")
  @UseGuards(AuthGuard)
  @SetMetadata("role", [Role.Manager, Role.Operator])
  public inquiry(@Payload() inquiry: AdminInquiryDto) {
    return this.client.send("admin.inquiry", inquiry);
  }

  @Post()
  @UseGuards(AuthGuard)
  @SetMetadata("role", [Role.Manager])
  public create(@Body(ValidationPipe) dto: AdminCreateDto) {
    return this.client.send("admin.create", dto);
  }

  @Get()
  @UseGuards(AuthGuard)
  public getMe(@Request() req: any) {
    return req.user;
  }
}
