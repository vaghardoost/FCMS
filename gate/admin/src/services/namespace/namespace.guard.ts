import { CanActivate, ExecutionContext, Inject, OnModuleInit } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common/enums";
import { HttpException } from "@nestjs/common/exceptions";
import { ClientKafka } from "@nestjs/microservices";
import { HeaderCode, MicroserviceRes } from "src/app.result";

export class NamespaceGuard implements CanActivate, OnModuleInit {
  constructor(@Inject("kafka-client") private readonly client: ClientKafka) { }

  onModuleInit() {
    this.client.subscribeToResponseOf("namespace.inquiry")
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { id } = context.switchToHttp().getRequest().params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new HttpException('id is invalid', HttpStatus.BAD_REQUEST);
    }
    const { id: author } = context.switchToHttp().getRequest().user;
    const res = this.client.send<MicroserviceRes<any>, string>("namespace.inquiry", JSON.stringify({ id: id, author: author }));
    const result = await new Promise(resolve => {
      res.subscribe(response => { resolve(response.header.code) })
    })
    if (result === HeaderCode.SUCCESS) {
      return true;
    } else {
      throw new HttpException("namespace not found", HttpStatus.UNAUTHORIZED);
    }
  }
}