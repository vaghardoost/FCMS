import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { AuthDto } from "./auth.dto";
import { ClientKafka } from "@nestjs/microservices";
import { HeaderCode, MicroserviceRes, Response } from "../../app.result";
import { sign } from "jsonwebtoken";
import { ConfigService } from "../config/config.service";

@Injectable()
export class AuthService implements OnModuleInit{
  constructor(
    @Inject('kafka-client') private readonly kafka:ClientKafka,
    private readonly configService:ConfigService,
  ) {}

  async onModuleInit() {
    this.kafka.subscribeToResponseOf('auth.admin');
  }

  public async admin(dto: AuthDto):Promise<Response<any>> {
    const res = this.kafka.send<MicroserviceRes<any>,string>('auth.admin',JSON.stringify(dto));
    return new Promise<Response<any>>(resolve => {
      res.subscribe(message => {
        const { header ,response } = message;
        if (header.code === HeaderCode.SUCCESS) {
          const {secret,ttl} = this.configService.config.jwt;
          const {payload} = header
          response.payload = { token:sign({...payload,password:dto.password},secret) }
        }
        resolve(response)
      })
    })
  }

}