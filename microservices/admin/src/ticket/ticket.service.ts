import { Injectable } from "@nestjs/common"
import TicketOpenDto from "./dto/ticket.open.dto";
import { Model } from "mongoose";
import TicketModel from "./ticket.model";
import { InjectModel } from "@nestjs/mongoose";
import RedisTicketService from "src/redis/redis.service.ticket";
import { Code, Result } from "src/app.result";
import TicketCloseDto from "./dto/ticket.close.dto";
import TicketPushDto from "./dto/ticket.push.dto";
import TicketNamespaceDto from "./dto/ticket.namespace.dto";

@Injectable()
export default class TicketService {

  constructor(
    @InjectModel('ticket') private readonly ticketModel: Model<TicketModel>,
    private readonly redis: RedisTicketService,
  ) { }

  public async open({ admin, message, title, namespace }: TicketOpenDto) {
    const new_ticket: TicketModel = {
      open: true,
      namespace: namespace,
      admin: admin,
      title: title,
      messages: [message],
    }
    const model = new this.ticketModel<TicketModel>(new_ticket);
    const result = await model.save();
    new_ticket.id = result._id.toString();
    this.redis.setTicket(new_ticket);
    return this.successResult(Code.CreateTicket, new_ticket);
  }

  public async close({ id }: TicketCloseDto) {
    await this.ticketModel.updateOne({ _id: id }, { $set: { open: false } });
    this.redis.deleteTicket(id);
    return this.successResult(Code.CloseTicket);
  }

  public async push({ content, from, id, attachment }: TicketPushDto) {
    const message = { from: from, content: content, attachment: attachment };
    await this.ticketModel.updateOne({ _id: id }, { $push: { messages: message } });
    const ticket = await this.redis.getTicket(id);
    ticket.messages.push(message);
    this.redis.setTicket(ticket);
    return this.successResult(Code.PushTicket, ticket);
  }

  public async operator() {
    const result = [];
    const raw = await this.redis.getAll();
    for (const key in raw) {
      const ticket = JSON.parse(raw[key]) as TicketModel;
      result.push(ticket);
    }
    return this.successResult(Code.TicketList, result);
  }

  public async reload() {
    await this.redis.clear();
    const result = await this.ticketModel.find<TicketModel>({ open: true }).lean();
    for (const item of result) {
      const ticket = { ...item, id: item._id.toString() };
      delete ticket._id;
      this.redis.setTicket(ticket);
    }
    return this.successResult(Code.Reload);
  }

  public async namespaceTicket({ namespace }: TicketNamespaceDto) {
    const result = [];
    const all = await this.redis.getAll();
    for (const key in all) {
      const ticket = JSON.parse(all[key]) as TicketModel;
      if (ticket.namespace === namespace) {
        result.push(ticket);
      }
    }
    return this.successResult(Code.TicketList, result);
  }

  private successResult<T>(code: number, payload?: T): Result<T> {
    return { code: code, success: true, payload: payload }
  }

}