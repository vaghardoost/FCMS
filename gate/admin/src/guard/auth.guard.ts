import { CanActivate, Inject, ExecutionContext, HttpException, HttpStatus, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { HeaderCode, MicroserviceRes } from "src/app.result";

@Injectable()
export class AuthGuard implements CanActivate, OnModuleInit {
    constructor(@Inject('kafka-client') private readonly client: ClientKafka) { }

    async onModuleInit() {
        this.client.subscribeToResponseOf('admin.inquiry')
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { user } = context.switchToHttp().getRequest();
        if (!user) {
            throw new HttpException("token not found", HttpStatus.BAD_REQUEST);
        }
        const res = this.client.send<MicroserviceRes<any>, string>('admin.inquiry', user);
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
