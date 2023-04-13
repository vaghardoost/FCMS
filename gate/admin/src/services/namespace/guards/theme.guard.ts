import { Injectable, Inject, CanActivate, OnModuleInit, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common"
import { ClientKafka } from "@nestjs/microservices"
import { HeaderCode, MicroserviceRes } from "src/app.result";

@Injectable()
export default class ThemeGuard implements CanActivate, OnModuleInit {
  constructor(@Inject("kafka-client") private readonly client: ClientKafka) { }

  onModuleInit() {
    this.client.subscribeToResponseOf("theme.inquiry");
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { id } = context.switchToHttp().getRequest().params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new HttpException('id is invalid', HttpStatus.BAD_REQUEST);
    }
    const res = this.client.send<MicroserviceRes<any>, string>("theme.inquiry", JSON.stringify({ id: id }));
    const result = await new Promise(resolve => {
      res.subscribe(response => { resolve(response.header.code) })
    })
    if (result === HeaderCode.SUCCESS) {
      return true;
    } else {
      throw new HttpException("theme not found", HttpStatus.BAD_REQUEST);
    }
  }
}
