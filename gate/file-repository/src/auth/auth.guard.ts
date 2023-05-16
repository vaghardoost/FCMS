import { CanActivate, ExecutionContext, HttpException, HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AuthGuard implements CanActivate, OnModuleInit {
  constructor(@Inject('kafka-client') private readonly kafka: ClientKafka) { }

  async onModuleInit() {
    this.kafka.subscribeToResponseOf('admin.inquiry');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new HttpException("token not found", HttpStatus.BAD_REQUEST);
    }
    return true
  }
}
