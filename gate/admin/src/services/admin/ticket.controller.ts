import { Param, Request, Post, Body, Put, Controller, Inject, Get, SetMetadata, OnModuleInit, UseGuards, ValidationPipe } from "@nestjs/common";
import { Role } from "src/app.roles";
import { AuthGuard } from "src/auth/auth.guard";
import TicketNamespaceDto from "./dto/ticket.namespace.dto";
import { ClientKafka } from "@nestjs/microservices";
import TicketOpenDto from "./dto/ticket.open.dto";
import TicketPushDto from "./dto/ticket.push.dto";
import { ValidationPipeId } from "../services.pipe";

@Controller('ticket')
export default class TicketController implements OnModuleInit {

  constructor(@Inject("kafka-client") private readonly client: ClientKafka) { }

  onModuleInit() {
    this.client.subscribeToResponseOf('ticket.namespace')
    this.client.subscribeToResponseOf('ticket.open')
    this.client.subscribeToResponseOf('ticket.push')
    this.client.subscribeToResponseOf('ticket.close')
    this.client.subscribeToResponseOf('ticket.operator')
    this.client.subscribeToResponseOf('ticket.reload')
  }

  @Get()
  @UseGuards(AuthGuard)
  @SetMetadata('role', [Role.Admin])
  public namespaceTicket(@Body(ValidationPipe) dto: TicketNamespaceDto) {
    return this.client.send('ticket.namespace', dto);
  }

  @Put()
  @UseGuards(AuthGuard)
  @SetMetadata('role', [Role.Admin])
  public openTicket(@Body(ValidationPipe) dto: TicketOpenDto, @Request() req: any) {
    return this.client.send('ticket.open', { ...dto, admin: req.user.id, content: { from: 'admin', content: dto.content } });
  }

  @Post('reload')
  @UseGuards(AuthGuard)
  @SetMetadata('role', [Role.Manager, Role.Operator])
  public reload() {
    return this.client.send('ticket.reload', {});
  }

  @Get('operator')
  @UseGuards(AuthGuard)
  @SetMetadata('role', [Role.Manager, Role.Operator])
  public operator() {
    return this.client.send('ticket.operator', {});
  }

  @Post(':id/push')
  @UseGuards(AuthGuard)
  @SetMetadata('role', [Role.Admin, Role.Manager, Role.Operator])
  public pushMessage(
    @Param('id', ValidationPipeId) id: string,
    @Body(ValidationPipe) dto: TicketPushDto,
    @Request() req: any) {
    return this.client.send('ticket.push', { ...dto, from: req.user.role, id: id })
  }

  @Post(':id/close')
  @UseGuards(AuthGuard)
  @SetMetadata('role', [Role.Manager, Role.Operator])
  public close(@Param('id', ValidationPipeId) id: string) {
    return this.client.send('ticket.close', { id: id })
  }

}
