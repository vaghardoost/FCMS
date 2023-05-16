import { CanActivate, ExecutionContext, Inject, OnModuleInit, HttpStatus, HttpException } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { HeaderCode, MicroserviceRes } from "src/app.result";

export class NamespaceGuard implements CanActivate, OnModuleInit {
  constructor(@Inject("kafka-client") private readonly client: ClientKafka) { }

  onModuleInit() {
    this.client.subscribeToResponseOf("namespace.inquiry")
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const namespace =
      context.switchToHttp().getRequest().params.namespace ??
      context.switchToHttp().getRequest().body.namespace;

    if (!namespace.match(/^[0-9a-fA-F]{24}$/)) {
      throw new HttpException('namespace id is invalid', HttpStatus.BAD_REQUEST);
    }
    const { id: author } = context.switchToHttp().getRequest().user;
    const res = this.client.send<MicroserviceRes<any>, string>("namespace.inquiry", JSON.stringify({ id: namespace, author: author }));
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