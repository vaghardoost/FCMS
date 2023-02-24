import { CanActivate, ExecutionContext, HttpException, HttpStatus, Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { HeaderCode, MicroserviceRes } from "../../../app.result";

@Injectable()
export class AuthGuard implements CanActivate, OnModuleInit {
    constructor(@Inject('kafka-client') private readonly kafka: ClientKafka) { }

    async onModuleInit() {
        this.kafka.subscribeToResponseOf('admin.inquiry')
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { user } = context.switchToHttp().getRequest();
        const res = this.kafka.send<MicroserviceRes<any>, string>('admin.inquiry', user);
        const result = await new Promise(resolve => {
            res.subscribe(response => { resolve(response.header.code) })
        })
        if (result === HeaderCode.SUCCESS) {
            return true;
        } else {
            throw new HttpException("token is unreliable", HttpStatus.UNAUTHORIZED);
        }
    }
}
