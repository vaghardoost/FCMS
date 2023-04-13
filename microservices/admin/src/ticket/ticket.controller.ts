import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import TicketOpenDto from "./dto/ticket.open.dto";
import TicketService from "./ticket.service";
import TicketCloseDto from "./dto/ticket.close.dto";
import TicketPushDto from "./dto/ticket.push.dto";
import TicketNamespaceDto from "./dto/ticket.namespace.dto";

@Controller()
export default class TickerController {

  constructor(private readonly service: TicketService) { }

  @MessagePattern('ticket.open')
  public async open(@Payload() dto: TicketOpenDto) {
    return this.service.open(dto);
  }

  @MessagePattern('ticket.close')
  public async close(@Payload() dto: TicketCloseDto) {
    return this.service.close(dto);
  }

  @MessagePattern('ticket.push')
  public async pushMessage(@Payload() dto: TicketPushDto) {
    return this.service.push(dto);
  }

  @MessagePattern('ticket.operator')
  public async operatorTicket() {
    return this.service.operator();
  }

  @MessagePattern('ticket.namespace')
  public async namespaceTicket(@Payload() dto: TicketNamespaceDto) {
    return this.service.namespaceTicket(dto);
  }

  @MessagePattern('ticket.reload')
  public async ticketReload() {
    return this.service.reload();
  }

}
